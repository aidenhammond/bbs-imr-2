import React, {useState} from "react";
import '../styles/Dashboard.css'


const Dashboard: React.FC = () => {
    let [telemetry, setTelemetry] = useState({});

    return (
        <div className="dashboard">
            <div id="dashboard-background" />
            <div id="top-container">
                <div className="left-small-col" >
                    <div id="left-content" >

                    </div>
                </div>
                <div className="middle-big-col" >
                    <div id="dashboard-title-div"> 
                        <h1 id="dashboard-title">MEMESat-1 Dashboard</h1>
                    </div>
                    <div id="control-panel" >

                    </div>
                </div>
                <div className="right-small-col">
                    <div id="news">
                        <h1>Recent news...</h1>
                    </div>
                    <div id="something-else">
                        <h1>something</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashboard;