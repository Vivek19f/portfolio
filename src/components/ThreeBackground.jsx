import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function ThreeBackground({ isSplineLoaded, setIsSplineLoaded }) {
  return (
    <>
      {!isSplineLoaded && (
        <div className="loading-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            Loading 3D Workspace...
          </motion.div>
        </div>
      )}
      
      <div className="spline-container">
        <Spline
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          onLoad={() => setIsSplineLoaded(true)}
        />
      </div>
    </>
  );
}
