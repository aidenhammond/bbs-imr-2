import "../../styles/Home.css"
import React from 'react';
import { Grid, Box } from "@mui/material";
import MemeTeam from "../../assets/meme team.jpg"

const MeetTheTeam: React.FC = () => {
    // TODO
    return (
        <div className="MeetTheTeamContainer">
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Box
                        height="100%"
                        display="flex"
                        justifyContent="center"
                        flexDirection="column"
                        >
                        <h2 id="meet-the-team-title">
                            Meet the team
                        </h2>
                    </Box>
                </Grid>
                <Grid item xs={6} justifyContent="center">
                    <Box 
                        height="100%"
                        display="flex"
                        
                        width="fit-content"
                    >
                        <img src={MemeTeam} id="memeteam"/>
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}
export default MeetTheTeam;