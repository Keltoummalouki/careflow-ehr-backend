import { Client } from 'minio'
import dotenv from 'dotenv'

dotenv.config()

// Configuration du client MinIO
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
})

// Nom du bucket pour les documents médicaux
export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'medical-documents'

// Initialiser le bucket
export async function initializeBucket() {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME)
    
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      console.log(`✅ MinIO bucket '${BUCKET_NAME}' created successfully`)
      
      // Définir la politique du bucket (privé par défaut)
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
            Condition: {
              StringEquals: {
                's3:ExistingObjectTag/public': 'yes'
              }
            }
          }
        ]
      }
      
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
      console.log(`✅ MinIO bucket policy set successfully`)
    } else {
      console.log(`✅ MinIO bucket '${BUCKET_NAME}' already exists`)
    }
  } catch (err) {
    console.error('❌ Error initializing MinIO bucket:', err)
    throw err
  }
}

export default minioClient