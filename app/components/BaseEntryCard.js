'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

export default function BaseEntryCard({ onClick, children }) {
  const cardContent = (
    <CardContent>
      {children}
    </CardContent>
  );

  return (
    <div className="mx-2 my-2">
      <Card variant="outlined">
        {onClick ? (
          <CardActionArea onClick={onClick}>
            {cardContent}
          </CardActionArea>
        ) : (
          cardContent
        )}
      </Card>
    </div>
  );
}