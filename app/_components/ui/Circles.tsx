
import { useState, useEffect } from 'react';
import Circle from './Circle';

type BaseProps = {

    initialRadius: number;
    incrementRadius: number;
    opacity?: number | (() => number)
}

type WithInitialColor = {
    initialColor: string;
    circlesNumber: number;
    customColors?: never;
}

type WithCustomColors = {
    customColors: string[];
    initialColor?: never;
    circlesNumber?: never;
}

type CirclesProps = BaseProps & (WithInitialColor | WithCustomColors)

export default function Circles({ circlesNumber, initialRadius, incrementRadius, customColors, initialColor, opacity }: CirclesProps) {
    function getCircles() {
        if (initialColor == undefined && customColors) {
            return customColors.map((customColor, index) => {
                const radius = initialRadius + incrementRadius * index
                const color = customColor
                return { radius, color, opacity:1 }
            })
        }
        if (initialColor != undefined && !customColors) {
            return Array.from({ length: circlesNumber }).map((_, index) => {
                const radius = initialRadius + incrementRadius * index
                const color = initialColor
                const opacity = Math.max(0.1, (50 - 5 * index) / 100)
                return { radius, color, opacity }
            })
        }
        throw new Error('You sude provide either initial color or the custom colors')
    }
    const circles = getCircles()
    return (
        <div className='relative overflow-hidden' style={{
            width:`${customColors ?
                `${customColors.length*incrementRadius + initialRadius}px`
                :
                `${(circlesNumber*incrementRadius + initialRadius)*2}px`}`,
            aspectRatio:'1/1'
        }}>
            {circles.map(({radius,color,opacity},index)=>{
                console.log({radius,color,opacity})
                return <Circle key={index} radius={radius} color={color} opacity={opacity}/>
            })}
        </div>
    );
}