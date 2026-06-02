'use client';

import React, { useEffect } from 'react';

export default function BloomCursor() {
    useEffect(() => {
        // Check if device supports hover (pointer: fine) to prevent custom cursor running on touch devices
        const isTouchDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (isTouchDevice) return;

        let lastSpawnX = 0;
        let lastSpawnY = 0;

        const spawnPetalTrail = (x: number, y: number) => {
            const trailPetal = document.createElement('div');
            trailPetal.className = 'bloom-cursor-trail-petal';
            trailPetal.style.left = `${x}px`;
            trailPetal.style.top = `${y}px`;

            const randomAngle = Math.random() * 360;
            const randomScale = Math.random() * 0.4 + 0.6; // scale between 0.6 and 1.0
            const randomRotateSpeed = (Math.random() - 0.5) * 80;

            trailPetal.style.transform = `translate3d(-50%, -50%, 0) rotate(${randomAngle}deg) scale(${randomScale})`;
            document.body.appendChild(trailPetal);

            // Animate after paint
            requestAnimationFrame(() => {
                const driftX = (Math.random() - 0.5) * 60;
                const driftY = Math.random() * 40 + 30; // float downwards
                const finalAngle = randomAngle + randomRotateSpeed;

                trailPetal.style.transform = `translate3d(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px), 0) rotate(${finalAngle}deg) scale(0)`;
                trailPetal.style.opacity = '0';
            });

            setTimeout(() => {
                trailPetal.remove();
            }, 1000);
        };

        const onMouseMove = (e: MouseEvent) => {
            // Spawn trail petal if mouse moved far enough
            const distSinceLastSpawn = Math.sqrt(
                Math.pow(e.clientX - lastSpawnX, 2) + Math.pow(e.clientY - lastSpawnY, 2)
            );
            if (distSinceLastSpawn > 16) {
                spawnPetalTrail(e.clientX, e.clientY);
                lastSpawnX = e.clientX;
                lastSpawnY = e.clientY;
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return null;
}
