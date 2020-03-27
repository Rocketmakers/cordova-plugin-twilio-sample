import * as React from "react";
import * as moment from "moment";
import { Button } from '@rocketmakers/armstrong';
import { useTwilio } from '../../hooks/useTwilio';

import "./home.scss";

export const HomeView: React.FunctionComponent = props => {
  const { status, makeCall, endCall, activeCall, callHistory, toggleSpeaker, speakerOn } = useTwilio("https://9728e293.ngrok.io/accessToken", "alice");
  return (
    <div>
      <p>{status}</p>
      {status === "ready" &&
        <Button onClick={() => makeCall("+44 1353 210101")}>CALL</Button>
      }
      {status === "connected" && !! activeCall &&
        <div>
          Call started {activeCall.duration}
          <Button onClick={endCall}>Hang up</Button>
          <Button onClick={toggleSpeaker}>Speaker {speakerOn ? 'Off' : 'On'}</Button>
        </div>
      }
      {callHistory.length !== 0 && callHistory.map(c => 
      <div>{moment(c.start).format("DD-MM-YYYY - HH:mm")} ({c.duration} seconds)</div>
      )}

    </div>
  );
}