import { useEffect, useRef, useState } from "react";

export default function CallPage() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer();
      peer.on("open", (id) => {
        setPeerId(id);
      });
      peer.on("call", (call) => {
        const getUserMedia = navigator.mediaDevices.getUserMedia;
        getUserMedia({ video: true, audio: true }).then((mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
          call.answer(mediaStream);
          call.on("stream", function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
        });
      });
      peerInstance.current = peer;
    });
  }, []);

  const call = (remotePeerId) => {
    const getUserMedia = navigator.mediaDevices.getUserMedia;
    getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
      const call = peerInstance.current.call(remotePeerId, mediaStream);
      call.on("stream", (remoteStream) => {
        console.log("got remote stream");
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  return (
    <div className="call-page">
      <h1>Current peer id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div className="videos">
        <div className="video">
          <video ref={currentUserVideoRef} />
          <p>My Video</p>
        </div>
        <div className="video">
          <video ref={remoteVideoRef} />
          <p>Remote Video</p>
        </div>
      </div>
    </div>
  );
}
