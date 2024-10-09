import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import { AppContext } from '../../../components/AppContext';
import Button from '../../../components/Button';
import { FontAwesome as FaIcon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { apiUrl } from '../../../../utils/fetchAPI';
import { getToken } from '../../../../utils/storage';
import ToastMessage from '../../../components/ToastMessage';
import * as Updates from 'expo-updates';

const VideoPreview = ({ video, reloadState }) => {
  const { setIsLoading, vw } = useContext(AppContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [hasPlayFinish, setHasPlayFinish] = useState(false);
  const videoPlayer = useRef(null);
  const navigation = useNavigation();

  const style = {
    width: vw * 0.9,
    height: vw * 0.9,
  };

  if (!video) {
    return <ActivityIndicator />;
  }

  const handlePlayVideo = async () => {
    if (!isPlaying) {
      if (hasPlayFinish) {
        await videoPlayer.current.replayAsync(0);
      } else {
        await videoPlayer.current.playAsync();
      }
      setHasPlayFinish(false);
      setIsPlaying(true);
      setShowOverlay(false);
    } else {
      setIsPlaying(false);
      setShowOverlay(true);
      await videoPlayer.current.pauseAsync();
    }
  };
  const handleVideoComplete = status => {
    if (status.didJustFinish) {
      setHasPlayFinish(true);
      setIsPlaying(false);
      setShowOverlay(true);
    }
  };
  const handleReload = () => {
    // Updates.reloadAsync();
    reloadState.setVideo(null);
    reloadState.setShowPreview(null);
    reloadState.setIsVideoRecorded(null);
  };

  const handleSubmit = async () => {
    try {
      if (!video) return ToastMessage('No video file found');
      setIsLoading(true);
      const token = await getToken();
      const videoFile = video.path ? `file://${video.path}` : video;
      const fileName = videoFile.split('/').pop();
      const fileType = fileName.split('.').pop();
      const formData = new FormData();

      formData.append('video', {
        uri: videoFile,
        name: fileName,
        type: `video/${fileType}`,
      });

      const options = {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await fetch(`${apiUrl}/user/verify/face`, options);

      if (response.status === 200) {
        ToastMessage('Submitted successfully, verification is pending');
        return navigation.replace('Splash');
      }
      const data = await response.json();
      throw new Error(data.message);
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header} />
      <View style={styles.camera}>
        <View
          style={{
            ...styles.container,
            maxWidth: vw * 0.9,
            maxHeight: vw * 0.9,
            minWidth: vw * 0.9,
            minHeight: vw * 0.9,
          }}>
          <Video
            source={{
              uri: video.path || video,
            }}
            style={style}
            useNativeControls={true}
            resizeMode={ResizeMode.COVER}
            ref={videoPlayer}
            onPlaybackStatusUpdate={handleVideoComplete}
          />
          <Pressable
            style={styles.overlayContainer}
            onPress={() => isPlaying && setShowOverlay(prev => !prev)}>
            {showOverlay && (
              <>
                <View style={styles.overlay} />
                <Pressable style={styles.play} onPress={handlePlayVideo}>
                  {isPlaying ? (
                    <FaIcon name="pause" color={'#fff'} size={50} />
                  ) : (
                    <FaIcon name="play" color={'#fff'} size={50} />
                  )}
                </Pressable>
              </>
            )}
          </Pressable>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button
          text={'Take Again'}
          style={styles.button}
          onPress={handleReload}
        />
        <Button
          text={'Continue'}
          style={styles.button}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default VideoPreview;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 30,
    marginVertical: 50,
  },
  header: {
    height: 50,
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  overlayContainer: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.6,
  },
  play: {
    maxWidth: 200,
  },
  container: {
    borderRadius: 1000,
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    columnGap: 30,
  },
  button: {
    flex: 1,
  },
});
