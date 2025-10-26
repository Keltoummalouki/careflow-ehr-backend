import minioClient, { BUCKET_NAME } from '../config/minio.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

class MinioService {
  /**
   * Upload un fichier vers MinIO
   * @param {Buffer} fileBuffer - Buffer du fichier
   * @param {string} originalName - Nom original du fichier
   * @param {string} mimeType - Type MIME du fichier
   * @param {object} metadata - Métadonnées additionnelles
   * @returns {Promise<object>} - Informations du fichier uploadé
   */
  async uploadFile(fileBuffer, originalName, mimeType, metadata = {}) {
    try {
      // Générer un nom unique pour le fichier
      const fileExtension = path.extname(originalName)
      const fileName = `${uuidv4()}${fileExtension}`
      const objectName = `documents/${fileName}`

      // Préparer les métadonnées
      const metaData = {
        'Content-Type': mimeType,
        'X-Original-Name': originalName,
        'X-Upload-Date': new Date().toISOString(),
        ...metadata
      }

      // Upload vers MinIO
      await minioClient.putObject(
        BUCKET_NAME,
        objectName,
        fileBuffer,
        fileBuffer.length,
        metaData
      )

      return {
        fileName,
        objectName,
        bucketName: BUCKET_NAME,
        size: fileBuffer.length,
        mimeType,
        uploadedAt: new Date()
      }
    } catch (err) {
      console.error('Error uploading file to MinIO:', err)
      throw new Error(`Failed to upload file: ${err.message}`)
    }
  }

  /**
   * Génère une URL présignée pour télécharger un fichier
   * @param {string} objectName - Nom de l'objet dans MinIO
   * @param {number} expirySeconds - Durée de validité en secondes (défaut: 600s = 10min)
   * @returns {Promise<string>} - URL présignée
   */
  async getPresignedDownloadUrl(objectName, expirySeconds = 600) {
    try {
      const url = await minioClient.presignedGetObject(
        BUCKET_NAME,
        objectName,
        expirySeconds
      )
      return url
    } catch (err) {
      console.error('Error generating presigned URL:', err)
      throw new Error(`Failed to generate download URL: ${err.message}`)
    }
  }

  /**
   * Télécharge un fichier depuis MinIO
   * @param {string} objectName - Nom de l'objet dans MinIO
   * @returns {Promise<Buffer>} - Buffer du fichier
   */
  async downloadFile(objectName) {
    try {
      return new Promise((resolve, reject) => {
        const chunks = []
        
        minioClient.getObject(BUCKET_NAME, objectName, (err, dataStream) => {
          if (err) {
            return reject(err)
          }

          dataStream.on('data', (chunk) => {
            chunks.push(chunk)
          })

          dataStream.on('end', () => {
            resolve(Buffer.concat(chunks))
          })

          dataStream.on('error', (err) => {
            reject(err)
          })
        })
      })
    } catch (err) {
      console.error('Error downloading file from MinIO:', err)
      throw new Error(`Failed to download file: ${err.message}`)
    }
  }

  /**
   * Supprime un fichier de MinIO
   * @param {string} objectName - Nom de l'objet dans MinIO
   */
  async deleteFile(objectName) {
    try {
      await minioClient.removeObject(BUCKET_NAME, objectName)
      return { success: true, message: 'File deleted successfully' }
    } catch (err) {
      console.error('Error deleting file from MinIO:', err)
      throw new Error(`Failed to delete file: ${err.message}`)
    }
  }

  /**
   * Récupère les métadonnées d'un fichier
   * @param {string} objectName - Nom de l'objet dans MinIO
   * @returns {Promise<object>} - Métadonnées du fichier
   */
  async getFileMetadata(objectName) {
    try {
      const stat = await minioClient.statObject(BUCKET_NAME, objectName)
      return stat
    } catch (err) {
      console.error('Error getting file metadata:', err)
      throw new Error(`Failed to get file metadata: ${err.message}`)
    }
  }

  /**
   * Liste les fichiers d'un préfixe donné
   * @param {string} prefix - Préfixe pour filtrer
   * @returns {Promise<Array>} - Liste des objets
   */
  async listFiles(prefix = 'documents/') {
    try {
      return new Promise((resolve, reject) => {
        const objectsList = []
        const stream = minioClient.listObjectsV2(BUCKET_NAME, prefix, true)

        stream.on('data', (obj) => {
          objectsList.push(obj)
        })

        stream.on('end', () => {
          resolve(objectsList)
        })

        stream.on('error', (err) => {
          reject(err)
        })
      })
    } catch (err) {
      console.error('Error listing files from MinIO:', err)
      throw new Error(`Failed to list files: ${err.message}`)
    }
  }
}

export default new MinioService()