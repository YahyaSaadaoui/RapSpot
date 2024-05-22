"use client";

import useSound from "use-sound";
import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { MdPlaylistAdd } from "react-icons/md";
import { Song } from "@/types";
import usePlaylistSongs from "@/hooks/usePlaylistSongs";
import usePlayer from "@/hooks/usePlayer";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react"

interface PlayerContentProps {
  song: Song;
  songUrl: string;
  playlistId: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl , playlistId}) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const supabaseClient = useSupabaseClient();
   const { playlistSongs } = usePlaylistSongs(playlistId);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  useEffect(() => {
    if (sound) {
      sound.play();
      setDuration(sound.duration());

      const interval = setInterval(() => {
        setCurrentTime(sound.seek());
      }, 1000);

      return () => {
        clearInterval(interval);
        sound.unload();
      };
    }
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  const handleTimeChange = (value: number) => {
    setCurrentTime(value);
    sound.seek(value);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const handleAddToPlaylist = async () => {
    const { error } = await supabaseClient
      .from('playlist_songs')
      .insert({ playlist_id: playlistId, song_id: song.id });

    if (error) {
      toast.error('Failed to add to playlist');
    } else {
      toast.success('Added to playlist');
    }
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full md:max-w-[722px]">
        <div className="flex items-center gap-x-6">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <MdPlaylistAdd
            onClick={handleAddToPlaylist}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
        </div>
        <div className="flex items-center gap-x-2 w-full text-[#1aa553]">
          <span className="text-white">{formatTime(currentTime)}</span>
          <Slider
            value={currentTime}
            onChange={handleTimeChange}
            max={duration}
            step={1}
            aria-label="Time"
          />
          <span className="text-white">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={34} />
          <Slider value={volume} onChange={(value) => setVolume(value)} aria-label="Volume" />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
