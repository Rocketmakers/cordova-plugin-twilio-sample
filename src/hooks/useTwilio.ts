import React = require('react');

interface IActiveCall {
  /** A timestamp of the call start datetime */
  start: number;
  /** The call object from the Twilio SDK */
  call: { callSid: string, isMuted: boolean };
  /** The current duration of the call in seconds */
  duration: number;
}

interface IHistoricalCall extends IActiveCall {
  /** A timestamp of the call end datetime */
  end: number;
}

type TwilioStatus = "uninitialized" | "ready" | "connecting" | "connected";

interface IUseTwilio {
  /** The current status of the plugin */
  status: TwilioStatus;
  /** The current active call */
  activeCall: IActiveCall;
  /** A list of all historical calls this session */
  callHistory: IHistoricalCall[];
  /** Make a call, passing in a SID or number */
  makeCall: (to: string) => void;
  /** End the current active call */
  endCall: () => void;
  /** The current state of the speaker */
  speakerOn: boolean;
  /** Toggle the speaker */
  toggleSpeaker: () => void;
}


export function useTwilio(tokenEndpoint: string, identity?: string): IUseTwilio {
  const [speakerOn, setSpeakerOn] = React.useState(false);
  const [status, setStatus] = React.useState<TwilioStatus>("uninitialized");
  const [callHistory, setCallHistory] = React.useState<IHistoricalCall[]>([]);
  const [activeCall, setActiveCall] = React.useState<IActiveCall>();

  const token = React.useRef("");
  const activeCallRef = React.useRef<IActiveCall>();
  const callTimer = React.useRef<number>();

  React.useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    let tokenResponse: Response;
    tokenResponse = await window.fetch(`${tokenEndpoint}?identity=${identity}`);
    if (!tokenResponse.ok) {
      throw `Problem retrieving access token from your server at ${tokenEndpoint}. Check your endpoint and API status and try again.`
    }
    const t = await tokenResponse.text()
    token.current = t;
    init();
  }

  const init = () => {
    Twilio.TwilioVoiceClient.onError(error => {
      console.error(`Error from twilio : ${JSON.stringify(error)}`);
      setStatus("ready");
    });

    Twilio.TwilioVoiceClient.onClientInitialized(() => {
      setStatus("ready");
    });

    Twilio.TwilioVoiceClient.initialize(token.current);

    Twilio.TwilioVoiceClient.onCallDidConnect(call => {
      const activeCall = {
        start: Date.now(),
        call,
        duration: 0
      }
      setActiveCall(activeCall);
      activeCallRef.current = activeCall;
      setStatus("connected");
      callTimer.current = window.setInterval(() => {
        updateCallDuration();
      }, 1000);
    });

    Twilio.TwilioVoiceClient.onCallDidDisconnect(call => {
      setCallHistory(ch => ch.concat({
        start: activeCallRef.current.start,
        end: Date.now(),
        duration: activeCallRef.current.duration,
        call
      }))
      window.clearInterval(callTimer.current);
      callTimer.current = null;
      setActiveCall(null)
      activeCallRef.current = null;
      setStatus("ready");
    });
  }

  const updateCallDuration = React.useCallback(() => {
    activeCallRef.current.duration += 1
    setActiveCall({ ...activeCall, duration: activeCallRef.current.duration });
  }, [activeCallRef, activeCall]);

  const makeCall = React.useCallback((to: string) => {
    setStatus("connecting");
    Twilio.TwilioVoiceClient.call(token.current, { "To": to });
  }, [token, status]);

  const endCall = React.useCallback(() => {
    setStatus("ready");
    Twilio.TwilioVoiceClient.disconnect();
  }, [status]);

  const toggleSpeaker = React.useCallback(() => {
    var newState = !speakerOn;
    setSpeakerOn(newState);
    Twilio.TwilioVoiceClient.setSpeaker(newState ? "on" : "off");
  }, [speakerOn]);

  return {
    status,
    speakerOn,
    makeCall,
    endCall,
    toggleSpeaker,
    activeCall,
    callHistory
  };
}