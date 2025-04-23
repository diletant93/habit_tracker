import crypto from 'crypto'
export function generateSecretKey(options?:{length:number}){
    const length = options?.length || 64
    return crypto.randomBytes(length).toString('hex').normalize()
}

export async function hashPassword(password:string, salt:string):Promise<string>{
    return new Promise((resolve,reject)=>{
        crypto.scrypt(password.normalize(),salt, 64, (error, hash)=>{
            if(error) reject(error)
            resolve(hash.toString('hex').normalize())
        })
    })
}

export async function comparePassword({
    inputPassword, userHashedPassword, salt
} :{
    inputPassword:string; userHashedPassword:string; salt:string;
}){
    const hashedInputPassword = await hashPassword(inputPassword,salt)
    return crypto.timingSafeEqual(
        Buffer.from(hashedInputPassword, 'hex'),
        Buffer.from(userHashedPassword, 'hex')
    )
}