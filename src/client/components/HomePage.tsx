import React, { Suspense } from "react";
import styles from "../styles/home.module.scss";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Cube from "./Cube";

const HomePage = () => {
  return (
    <div className={styles.home}>
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
          <h1 className={styles.title}>Think outside the square space</h1>
          <div className={styles.what}>
            <img className={styles.line} src="/line.png" />
            <h2 className={styles.subtitle}>Who we Are</h2>
          </div>
          <p className={styles.desc}>
            a group of developers with a passion for the helping students.
          </p>
          <a href="/login">
            <button className={styles.button}>Get Started</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;