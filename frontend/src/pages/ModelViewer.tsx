import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { FBXLoader } from "three-stdlib";
import * as THREE from "three";

function Axes() {
  const { scene } = useThree();

  useEffect(() => {
    const helper = new THREE.AxesHelper(5);
    scene.add(helper);

    return () => {
      scene.remove(helper);
    };
  }, [scene]);

  return null;
}

const ModelScene = ({ url }: { url: string }) => {
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(
      url,
      (fbx) => {
        fbx.scale.set(0.1, 0.1, 0.1);
        fbx.position.set(0, 0, 0);
        setModel(fbx);
      },
      undefined,
      (error) => {
        console.error("Error loading FBX model:", error);
      }
    );
  }, [url]);

  return model ? <primitive object={model} /> : null;
};

const ModelViewer = () => {
  const { id } = useParams();
  const [postcard, setPostcard] = useState<{ id: number; model: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchModel() {
      try {
        const res = await axios.get(`http://localhost:3001/api/postcards/${id}`);
        setPostcard(res.data);
      } catch (error) {
        console.error("Error fetching postcard:", error);
      }
    }
    fetchModel();
  }, [id]);

  if (!postcard) return <div>Loading model...</div>;

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="hotpink" />
            </mesh>
          }
        >
          <ModelScene url={postcard.model} />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls />
        <Axes />
      </Canvas>
    </div>
  );
};

export default ModelViewer;
