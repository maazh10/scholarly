import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import apiService from "@/services/apiService";

import styles from "../styles/meeting.module.scss";

export default function Meeting({ appointment, user, peer, session }) {
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const callInstance = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    if (!appointment || !peer) {
      router.push("/dashboard");
    }
    if (session) call(session.peerId);

    peer.on("call", (call) => {
      const getUserMedia = navigator.mediaDevices.getUserMedia;
      getUserMedia({ video: true, audio: true }).then((mediaStream) => {
        getUserMedia({ video: true, audio: false }).then((myVideo) => {
          currentUserVideoRef.current.srcObject = myVideo;
          currentUserVideoRef.current.play();
          call.answer(mediaStream);
          call.on("stream", function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
          call.on("close", () => {
            mediaStream.getTracks().forEach((track) => track.stop());
            myVideo.getTracks().forEach((track) => track.stop());
          });
          callInstance.current = call;
        });
      });
    });
  }, []);

  const call = (remotePeerId) => {
    const getUserMedia = navigator.mediaDevices.getUserMedia;
    getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      getUserMedia({ video: true, audio: false }).then((myVideo) => {
        currentUserVideoRef.current.srcObject = myVideo;
        currentUserVideoRef.current.play();
        const call = peer.call(remotePeerId, mediaStream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
        call.on("close", () => {
          mediaStream.getTracks().forEach((track) => track.stop());
          myVideo.getTracks().forEach((track) => track.stop());
        });
        callInstance.current = call;
      });
    });
  };

  const handleDisconnect = async () => {
    callInstance.current.close();
    peer.destroy();
    await apiService.delete("/sessions?appointmentId=" + appointment.id);
    router.push("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.videos}>
        <div className={styles.video}>
          <video ref={currentUserVideoRef} />
          <p>My Video</p>
        </div>
        <div className={styles.video}>
          <video ref={remoteVideoRef} />
          <p>Remote Video</p>
        </div>
        <button onClick={handleDisconnect}>End Call</button>
      </div>
    </div>
  );
}

Meeting.getInitialProps = async (ctx) => {
  const { appointmentId } = ctx.query;
  let user = null;
  let appointment = null;
  try {
    const userRes = await apiService.get("/users/me");
    const loggedInUser = (userRes as { user: any }).user;
    user = loggedInUser;
  } catch (err) {
    ctx.res.writeHead(403, { Location: "/login" });
  }
  try {
    const appointmentRes = await apiService.get(
      `/appointments/${appointmentId}`
    );
    appointment = (appointmentRes as { appointment: any }).appointment;
    if (
      user.userType === "student" &&
      user.studentId !== appointment.StudentId
    ) {
      ctx.res.writeHead(403, { Location: "/dashboard" });
    }
    if (user.userType === "tutor" && user.tutorId !== appointment.TutorId) {
      ctx.res.writeHead(403, { Location: "/dashboard" });
    }
  } catch (err) {
    ctx.res.writeHead(403, { Location: "/dashboard" });
  }

  const peerjs = await import("peerjs");
  const peer = new peerjs.default();
  let session = null;

  const sessionPromise = new Promise((resolve, reject) => {
    peer.on("open", async (id) => {
      try {
        let res = await apiService.get(
          "/sessions?appointmentId=" + appointmentId
        );
        session = (res as { session: { peerId: string } }).session;
        resolve(session);
      } catch (err) {
        if (err.response.status === 404) {
          try {
            await apiService.post("/sessions", {
              appointmentId,
              peerId: id,
            });
            resolve(session);
          } catch (err) {
            ctx.res.writeHead(err.response.status, {
              Location: "/dashboard",
            });
            reject(err);
          }
        } else {
          ctx.res.writeHead(err.response.status, { Location: "/dashboard" });
          reject(err);
        }
      }
    });
  });

  try {
    session = await sessionPromise;
  } catch (err) {
    console.error(err);
  }

  return { appointment, user, peer, session };
};
