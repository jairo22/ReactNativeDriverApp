import { Platform } from 'react-native'
import * as _ from 'lodash'
import * as FileSystem from 'expo-file-system'
import * as VideoThumbnails from 'expo-video-thumbnails'
// import { FFmpegKit } from 'ffmpeg-kit-react-native' // ya no se usa
import * as ImageManipulator from 'expo-image-manipulator'
import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'

const BASE_DIR = `${FileSystem.cacheDirectory}expo-cache/`

async function ensureDirExists(givenDir) {
  const dirInfo = await FileSystem.getInfoAsync(givenDir)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(givenDir, { intermediates: true })
  }
}

export const downloadFile = async (file, fileName) => {
  try {
    await ensureDirExists(BASE_DIR)
    const fileUri = `${BASE_DIR}${fileName}`
    const info = await FileSystem.getInfoAsync(fileUri)
    const { exists, uri } = info

    if (exists) {
      return { uri }
    }

    const downloadResumable = FileSystem.createDownloadResumable(file, fileUri)

    return downloadResumable.downloadAsync()
  } catch (error) {
    return { uri: null }
  }
}

// Función modificada para usar el backend
const compressVideo = async (sourceUri) => {
  const formData = new FormData();
  formData.append('video', {
    uri: sourceUri,
    name: 'video.mp4',
    type: 'video/mp4',
  });

  const response = await fetch('https://ffmpeg-backend-qzo4.onrender.com/compress-video', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const json = await response.json();
  return json.processedUri;
}

/* Código anterior reemplazado
const compressVideo = async sourceUri => {
  if (Platform.OS === 'ios' || Platform.OS === 'web') {
    return new Promise(resolve => {
      console.log("no compression needed, as it's iOS or web")
      resolve(sourceUri)
    })
  }

  FileSystem.getInfoAsync(sourceUri).then(fileInfo => {
    console.log(
      'compressing video of initial size ' +
        fileInfo.size / (1024 * 1024) +
        'M',
    )
    console.log(sourceUri)
  })

  await ensureDirExists(BASE_DIR)

  const processedUri = `${BASE_DIR}${uuid()}.mp4`
  return new Promise(resolve => {
    FFmpegKit.execute(`-i ${sourceUri} -c:v mpeg4 ${processedUri}`).then(
      async session => {
        FileSystem.getInfoAsync(processedUri).then(fileInfo => {
          console.log(
            'compressed video to size ' + fileInfo.size / (1024 * 1024) + 'M',
          )
          console.log(processedUri)
        })

        resolve(processedUri)
      },
    )
  })
}
*/

// Nueva versión para generar thumbnail usando backend
const createThumbnailFromVideo = async (videoUri) => {
  const formData = new FormData();
  formData.append('video', {
    uri: videoUri,
    name: 'video.mp4',
    type: 'video/mp4',
  });

  const response = await fetch('https://ffmpeg-backend-qzo4.onrender.com/create-thumbnail', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const json = await response.json();
  return {
    uri: json.thumbnailUri,
    fileName: 'thumbnail.jpg',
  };
}

/* Código anterior reemplazado
const createThumbnailFromVideo = videoUri => {
  let processedUri = videoUri
  if (Platform.OS === 'android' && !processedUri.includes('file:///')) {
    processedUri = `file://${processedUri}`
  }
  console.log('createThumbnailFromVideo processedUri ' + processedUri)
  return new Promise(resolve => {
    if (Platform.OS === 'web') {
      return resolve(null)
    }
    VideoThumbnails.getThumbnailAsync(processedUri)
      .then(newThumbnailSource => {
        resolve(newThumbnailSource)
      })
      .catch(error => {
        console.log(error)
        resolve(null)
      })
  })
}
*/

const resizeImage = async ({ image }, callback) => {
  const imagePath = image?.path || image?.uri

  ImageManipulator.manipulateAsync(imagePath, [], {
    compress: 0.7,
    format: ImageManipulator.SaveFormat.JPEG,
  })
    .then(newSource => {
      if (newSource) {
        callback(newSource.uri)
      }
    })
    .catch(err => {
      callback(imagePath)
    })
}

export const processMediaFile = (file, callback) => {
  const { type, uri, path } = file
  const fileSource = uri || path

  const includesVideo = type?.includes('video')
  if (includesVideo) {
    compressVideo(fileSource).then(processedUri => {
      createThumbnailFromVideo(processedUri).then(thumbnail => {
        callback({
          thumbnail,
          processedUri,
        })
      })
    })
    return
  }

  const includesImage = type?.includes('image')
  if (includesImage) {
    resizeImage({ image: file }, processedUri => {
      callback({ processedUri })
    })
    return
  }
  callback({ processedUri: fileSource })
}

// Nueva versión usando backend para combinar audio y video
export const blendVideoWithAudio = async ({ videoStream, audioStream, videoRate }, callback) => {
  const formData = new FormData();
  formData.append('video', {
    uri: videoStream,
    name: 'video.mp4',
    type: 'video/mp4',
  });
  formData.append('audio', {
    uri: audioStream,
    name: 'audio.mp3',
    type: 'audio/mpeg',
  });

  if (videoRate) {
    formData.append('videoRate', videoRate.toString());
  }

  const response = await fetch('https://ffmpeg-backend-qzo4.onrender.com/blend-video-audio', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const json = await response.json();
  callback(json.processedUri);
}

/* Código anterior reemplazado
export const blendVideoWithAudio = async (
  { videoStream, audioStream, videoRate },
  callback,
) => {
  await ensureDirExists(BASE_DIR)
  const processedUri = `${BASE_DIR}${uuid()}.mp4`
  let command = `-i ${videoStream} -i ${audioStream} -map 0:v:0 -map 1:a:0 -shortest ${processedUri}`

  if (videoRate) {
    command = `-i ${videoStream} -i ${audioStream} -filter:v "setpts=PTS/${videoRate}" -map 0:v:0 -map 1:a:0 -shortest ${processedUri}`
  }

  console.log('blendVideoWithAudio command ' + command)
  FFmpegKit.execute(command).then(async session => {
    const output = await session.getOutput()
    callback(processedUri)
  })
}
*/