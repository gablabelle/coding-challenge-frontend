import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getFlickrApiResults } from './FlickrApi';

interface MatchParams {
  keyword?: string;
}

interface FlickrProviderProps {
  routeProps: RouteComponentProps<MatchParams>;
  children: (renderProps: FlickrProviderRenderProps) => void;
}

export interface FlickrPhoto {
  farm: number;
  height_q: string;
  id: string;
  isfamily: number;
  isfriend: number;
  ispublic: number;
  owner: string;
  ownername: string;
  secret: string;
  server: string;
  title: string;
  url_q: string;
  width_q: string;
}

interface FlickrProviderState {
  keyword: string;
  photos: FlickrPhoto[];
  nextPage: number;
  error: string;
}

export interface FlickrProviderRenderProps {
  photos: FlickrProviderState['photos'];
  keyword: string;
  updateKeyword: (keyword: string) => void;
  error: string;
}

class FlickrProvider extends PureComponent<
  FlickrProviderProps,
  FlickrProviderState
> {
  state = {
    keyword: '',
    photos: [],
    nextPage: 1,
    error: ''
  };

  componentDidMount() {
    const { keyword } = this.props.routeProps.match.params;
    this.getFlickrResults(keyword);
  }

  componentDidUpdate() {
    const { keyword } = this.props.routeProps.match.params;
    this.getFlickrResults(keyword);
  }

  getFlickrResults = async (keyword?: string) => {
    const { keyword: previousKeyword } = this.state;

    if (!keyword || keyword === previousKeyword) return;

    // Async set keyword state ASAP
    this.setState({
      keyword
    });

    const payload: any = await getFlickrApiResults(keyword).catch(error => {
      // TODO: Error handling (notication, node-bunyan, etc)
      console.error(error);
      return this.setState({
        error
      });
    });

    // Async set results state whenever they arrive
    this.setState({
      photos: payload.data.photos.photo,
      error: ''
    });
  };

  updateKeyword = (keyword: string = '') => {
    const { push } = this.props.routeProps.history;
    push(`/search/${keyword.toLowerCase()}`);
  };

  render() {
    const { children } = this.props;
    const { photos, keyword, error } = this.state;

    return (
      <>
        {children({
          photos,
          keyword,
          updateKeyword: this.updateKeyword,
          error
        })}
      </>
    );
  }
}

export default FlickrProvider;
