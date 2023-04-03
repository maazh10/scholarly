import React, { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Cube from "../components/Cube";
import Typewriter from "typewriter-effect";
import Head from "next/head";

import styles from "../styles/home.module.scss";

export default function Index() {
  return (
    <div className={styles.page}>
      <Head>
        <title>Scholarly</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.left}>
          <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[3, 2, 1]} />
              <Cube />
              <OrbitControls enableZoom={false} autoRotate />
            </Suspense>
          </Canvas>
        </div>
        <div className={styles.right}>
          <h1 className={styles.title}>
            Welcome to <span>Scholarly.</span>
          </h1>
          <div className={styles.desc}>
            <Typewriter
              options={{
                strings: [
                  "Chat, Learn, Grow",
                  "Connect, Collaborate, Achieve",
                  "Explore, Discover, Create",
                  "Think Outside the Box",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
          <a href="/login">
            <button className={styles.button}>Get Started</button>
          </a>
        </div>
      </div>
    </div>
  );
}
