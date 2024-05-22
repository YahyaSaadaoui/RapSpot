import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { PlaylistSong } from "@/types";

const usePlaylistSongs = (playlistId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState<PlaylistSong[]>([]);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!playlistId) {
      return;
    }

    setIsLoading(true);

    const fetchPlaylistSongs = async () => {
      const { data, error } = await supabaseClient
        .from("playlist_songs")
        .select("*")
        .eq("playlist_id", playlistId);

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      setPlaylistSongs(data as PlaylistSong[]);
      setIsLoading(false);
    };

    fetchPlaylistSongs();
  }, [playlistId, supabaseClient]);

  return useMemo(
    () => ({
      isLoading,
      playlistSongs,
    }),
    [isLoading, playlistSongs]
  );
};

export default usePlaylistSongs;
