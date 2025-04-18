type CircleProps= {
    color:string;
    radius:number;
    opacity:number;
}
export default function Circle({color,radius, opacity}:CircleProps) {
  return (
    <div style={{
        width:`${radius*2}px`,
        aspectRatio:'1/1',
        position:'absolute',
        transform:'translate(-50%,-50%)',
        top:'50%',
        left:'50%',
        zIndex:`${-radius}`,
        backgroundColor:`${color}`,
        opacity:`${opacity}`,
        borderRadius:'50%',
    }}>
    </div>
  );
}
