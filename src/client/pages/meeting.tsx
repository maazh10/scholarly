import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import apiService from "@/services/apiService";
import Loading from "@/components/Loading";
import Head from "next/head";

import styles from "../styles/meeting.module.scss";

export default function Meeting({ appointment, user, peer, session }) {
  const [showButton, setShowButton] = useState(false);

  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const callInstance = useRef(null);
  const router = useRouter();

  const handleMouseEnter = () => {
    setShowButton(true);
  };

  const handleMouseLeave = () => {
    setShowButton(false);
  };

  useEffect(() => {
    if (!user) router.push("/login");
    if (!appointment || !peer) {
      router.push("/dashboard");
    }
    if (session) call(session.peerId);

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
        call.on("close", () => {
          mediaStream.getTracks().forEach((track) => track.stop());
        });
        callInstance.current = call;
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const call = (remotePeerId) => {
    const getUserMedia = navigator.mediaDevices.getUserMedia;
    getUserMedia({ video: true, audio: true }).then((mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
      const call = peer.call(remotePeerId, mediaStream);
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
      call.on("close", () => {
        mediaStream.getTracks().forEach((track) => track.stop());
      });
      callInstance.current = call;
    });
  };

  const handleDisconnect = async () => {
    if (callInstance.current) callInstance.current.close();
    peer.destroy();
    await apiService.delete("/sessions?appointmentId=" + appointment.id);
    router.push("/dashboard");
  };

  return (
    <>
      {appointment ? (
        <div className={styles.page}>
          <Head>
            <title>Meeting</title>
          </Head>
          <div className={styles.videos} onMouseEnter={handleMouseEnter}>
            <video className={styles.video1} ref={remoteVideoRef} />
            <video className={styles.video2} ref={currentUserVideoRef} muted />
            {showButton && (
              <div onMouseLeave={handleMouseLeave} className={styles.btns}>
                <button onClick={handleDisconnect}></button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
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
