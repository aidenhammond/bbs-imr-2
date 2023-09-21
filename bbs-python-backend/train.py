import torch
from torch.utils.data import Dataset, DataLoader
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, AdamW
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import pandas as pd
import numpy as np

class TweetDataset(Dataset):

        def __init__(self, tweets, labels, tokenizer, max_len):
            self.tweets = tweets
            self.labels = labels
            self.tokenizer = tokenizer
            self.max_len = max_len

        def __len__(self):
            return len(self.tweets)

        def __getitem__(self, idx):
            tweet = str(self.tweets[idx])
            label = self.labels[idx]
            encoding = self.tokenizer.encode_plus(
                tweet,
                add_special_tokens=True,
                max_length=self.max_len,
                return_token_type_ids=False,
                padding='max_length',
                return_attention_mask=True,
                return_tensors='pt',
            )

            return {
                'tweet': tweet,
                'input_ids': encoding['input_ids'].flatten(),
                'attention_mask': encoding['attention_mask'].flatten(),
                'label': torch.tensor(label, dtype=torch.long)
            }
if __name__ == "__main__":

    df = pd.read_csv("data/labeled_data.csv")
    df_train, df_test = train_test_split(df, test_size=0.1, random_state=42)

    tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')

    def create_data_loader(df, tokenizer, max_len, batch_size):
        ds = TweetDataset(
            tweets=df.tweet.to_numpy(),
            labels=df['class'].to_numpy(),
            tokenizer=tokenizer,
            max_len=max_len
        )

        return DataLoader(
            ds,
            batch_size=batch_size,
            num_workers=4,
        )

    BATCH_SIZE = 16
    MAX_LEN = 512
    train_data_loader = create_data_loader(df_train, tokenizer, MAX_LEN, BATCH_SIZE)
    test_data_loader = create_data_loader(df_test, tokenizer, MAX_LEN, BATCH_SIZE)

    model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=3)
    model = model.to('mps')

    optimizer = AdamW(model.parameters(), lr=2e-5, correct_bias=False)

    EPOCHS = 5

    for epoch in range(EPOCHS):
        print(f"Epoch: {epoch}")
        correct_predictions_train = 0
        for data in tqdm(train_data_loader):
            input_ids = data["input_ids"].to('mps')
            attention_mask = data["attention_mask"].to('mps')
            labels = data["label"].to('mps')

            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels
            )

            _, preds = torch.max(outputs[1], dim=1)
            correct_predictions_train += torch.sum(preds == labels)

            loss = outputs[0]
            loss.backward()

            optimizer.step()
            optimizer.zero_grad()

        correct_predictions_test = 0
        for data in test_data_loader:
            input_ids = data["input_ids"].to('mps')
            attention_mask = data["attention_mask"].to('mps')
            labels = data["label"].to('mps')

            with torch.no_grad():
                outputs = model(
                    input_ids=input_ids,
                    attention_mask=attention_mask
                )

            _, preds = torch.max(outputs[0], dim=1)
            correct_predictions_test += torch.sum(preds == labels)
        torch.save(model.state_dict(), 'model.pt')
        train_acc = correct_predictions_train / len(df_train)
        test_acc = correct_predictions_test / len(df_test)

        print(f'Train Accuracy = {train_acc:.2f}, Test Accuracy = {test_acc:.2f}')

    # save model
    torch.save(model.state_dict(), 'model.pt')

