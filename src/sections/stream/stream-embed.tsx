import { bo } from '@fullcalendar/core/internal-common';
import { Box, Card } from '@mui/material';
import React from 'react';

type Props = {
  youtubeId?: string;
  slidoId?: string;
  autoplay?: boolean;
};

const renderYoutube = (youtubeId: string) =>
  youtubeId && (
    <Card>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${youtubeId}?si=i8DkcKd6mRgqNoHG`}
        style={{ minHeight: '220px' }}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </Card>
  );

const renderSlido = (slidoId: string) =>
  slidoId && (
    <Card>
      <iframe
        loading="lazy"
        height="100%"
        width="100%"
        frameBorder="0"
        style={{ minHeight: '480px' }}
        title="Slido"
        className=" lazyloaded"
        src={`https://app.sli.do/event/${slidoId}/live/questions`}
      />
    </Card>
  );

export default function StreamEmbed({ youtubeId = '', slidoId = '' }: Props) {
  const boxProps = {
    rowGap: 1,
    columnGap: 2,
    display: 'grid',
    gridTemplateColumns: {
      sm: 'repeat(1, 1fr)',
      md: '65% 35%',
    },
    minHeight: {
      md: 480,
      xs: 480,
    },
    sx: {
      mt: 5,
      mb: 5,
      // borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
    },
  };

  if (!youtubeId || !slidoId) {
    boxProps.gridTemplateColumns.md = '1fr';
    boxProps.minHeight.md = 620;
  }

  return (
    <Box {...boxProps}>
      {renderYoutube(youtubeId)}
      {renderSlido(slidoId)}
    </Box>
  );
}
