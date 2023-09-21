import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Sidebar.css";

type SidebarProps = {
    items: (
      | { type: 'button'; title: string; path: string }
      | { type: 'dropdown'; title: string; items: { title: string; path: string }[] }
    )[];
  };

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);

  return (
    <div className="sidebar">
      {items.map((item, index) => (
        <div key={index}>
          {item.type === 'button' ? (
            <Link to={item.path}>{item.title}</Link>
          ) : (
            <>
              <button onClick={() => setOpenSectionIndex(openSectionIndex === index ? null : index)}>
                {item.title}
              </button>
              {openSectionIndex === index && (
                <ul>
                  {item.items.map((subItem, subItemIndex) => (
                    <li key={subItemIndex}>
                      <Link to={subItem.path}>{subItem.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
