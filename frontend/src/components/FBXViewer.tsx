// components/FBXViewer.tsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { FBXLoader } from "three-stdlib";
import { useLoader } from "@react-three/fiber";

type Props = {
  url: string;
};

const Model = ({ url }: Props) => {
  const fbx = useLoader(FBXLoader, url);
  return <primitive object={fbx} scale={0.01} />;
};

const FBXViewer = ({ url }: Props) => {
  return (
    <div style={{ height: 300, border: "1px solid #ccc", marginBottom: 20 }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Stage>
            <Model url={url} />
          </Stage>
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default FBXViewer;
