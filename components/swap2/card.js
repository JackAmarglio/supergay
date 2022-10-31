import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { alpha, styled } from '@mui/material/styles';
import { 
    Stack,
    Box, 
    Link, 
    Card, 
    Grid, 
    Avatar, 
    Typography, 
    CardContent, 
    IconButton, 
    CardActionArea 
} from '@mui/material';

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  bottom: theme.spacing(-2)
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

export default function ExplorePostCard(props) {
  const router = useRouter();
  const {
    id,
    to,
    from
  } = props;
  return (
    <Grid item xs={12}>
      <Card>
        <CardActionArea onClick={() => router.push(`/swap/${id}`)} sx={{ position: 'relative', height: 251 }}>
            <CardMediaStyle
                sx={{
                    '&:after': {
                    top: 0,
                    content: "''",
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
                    },
                    pt: {
                    xs: 'calc(100% * 4 / 3)',
                    sm: 'calc(100% * 3 / 4.66)'
                    }
                }}
            >
                <Stack
                    direction={["column", "row"]}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        zIndex: 9,
                        position: 'absolute',
                        top: 24,
                        width: '100%',
                        pr: 5,
                        pl: 5
                    }}
                >
                    <Stack
                        direction={"row"}
                        alignItems="center"
                        spacing={2}
                    >
                        <AvatarStyle
                            alt={from}
                            src={`https://web3-images-api.kibalabs.com/v1/accounts/${from}`}
                            sx={{
                                width: 40,
                                height: 40
                            }}
                        />
                        <Typography
                            gutterBottom
                            variant="caption"
                            sx={{ 
                                color: 'text.disabled', 
                                display: 'block',
                                pt: 4
                            }}
                            noWrap
                        >
                            {from}
                        </Typography>
                    </Stack>
                    <Stack
                        direction={"row"}
                        alignItems="center"
                        spacing={2}
                    >
                        <Typography
                            gutterBottom
                            variant="caption"
                            sx={{ 
                                color: 'text.disabled', 
                                display: 'block',
                                pt: 4
                            }}
                            noWrap
                        >
                            {to}
                        </Typography>
                        <AvatarStyle
                            alt={to}
                            src={`https://web3-images-api.kibalabs.com/v1/accounts/${to}`}
                            sx={{
                                width: 40,
                                height: 40
                            }}
                        />
                    </Stack>
                </Stack>
                
                <CoverImgStyle alt="title" src="https://source.unsplash.com/random" />
            </CardMediaStyle>
            <CardContent
                sx={{
                    pt: 4,
                    bottom: 0,
                    width: '100%',
                    position: 'absolute'
                }}
            >
                <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ color: 'text.disabled', display: 'block' }}
                >
                    Date
                </Typography>
                <TitleStyle
                    color="inherit"
                    variant="subtitle2"
                    underline='none'
                    sx={{
                        typography: 'h5', 
                        height: 60,
                        color: 'common.white'
                    }}
                    >
                    Status: 
                </TitleStyle>
            </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}