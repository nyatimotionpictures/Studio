import 'video-react/dist/video-react.css';
import Player from 'react-player';

type VideoStreamProps = {
  filmId: string;
};

function VideoStream({ filmId }: VideoStreamProps) {
  if (!filmId) {
    return <h1>Loading video...</h1>;
  }
  const videoEndpoint = `http://localhost:4500/api/v1/film/stream/${filmId}`;
  return (
    <div className="h-96 w-full max-h-96 max-w-xl mx-auto space-y-4">
      <Player
        url={videoEndpoint}
        controls
        width="100%"
        height="100%"
        autoPlay
      />
    </div>
  );
}

export default VideoStream;
