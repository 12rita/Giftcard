import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { queryClient } from '../../App';
import { message } from 'antd';
import { useSingleMutation } from './useSingleMutation';
import { ROUTES } from '../../static/routes';
import { IDetailsData } from '../DetailsDrawer/DetailsDrawer';

interface ISaveReaction {
    messageId: number;
    reaction: number;
}
interface IReactionPost {
    [key: number]: {
        likesCount: number;
        dislikesCount: number;
        reaction: number;
    };
}
interface IDeletePost {
    messageId: number;
}
type Reaction = 'like' | 'dislike';

type TUseHandleReaction = () => {
    setReaction: (item: IDetailsData, reaction: Reaction) => void;
    setLocalReaction: Dispatch<SetStateAction<IReactionPost>>;
    reaction: IReactionPost;
    deleteMessage: (item: IDetailsData) => void;
};
export const useHandleReaction: TUseHandleReaction = () => {
    const saveReaction = useSingleMutation<ISaveReaction>(ROUTES.REACTION);
    const deletePost = useSingleMutation<IDeletePost>(ROUTES.MESSAGE_DELETE);
    const [reaction, setLocalReaction] = useState({} as IReactionPost);
    const [loading, setLoading] = useState(false);
    const deleteMessage = (item: IDetailsData) => {
        if (item.isDeletable) {
            deletePost.mutate(
                { messageId: item.id },
                {
                    onSuccess: () => {
                        void queryClient.invalidateQueries(['details-data']);
                        void queryClient.invalidateQueries(['map-data']);
                        void message.success(
                            'Вы удалили ваши фотки, но интернет всё помнит...'
                        );
                    },
                    onError: err => void message.error(err.message)
                }
            );
        }
    };

    const setReaction = useCallback(
        (item: IDetailsData, reaction: Reaction) => {
            if (loading) return;
            setLoading(true);
            if (item.isLiked) {
                if (reaction === 'like') {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount - 1,
                            dislikesCount: prev[item.id].dislikesCount,
                            reaction: 0
                        }
                    }));

                    saveReaction.mutate(
                        { messageId: item.id, reaction: 0 },
                        {
                            onSuccess: () =>
                                void queryClient.invalidateQueries([
                                    'details-data'
                                ]),
                            onError: err => void message.error(err.message),
                            onSettled: () => setLoading(false)
                        }
                    );
                } else {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount - 1,
                            dislikesCount: prev[item.id].dislikesCount + 1,
                            reaction: -1
                        }
                    }));

                    saveReaction.mutate(
                        { messageId: item.id, reaction: -1 },
                        {
                            onSuccess: () =>
                                void queryClient.invalidateQueries([
                                    'details-data'
                                ]),
                            onError: err => void message.error(err.message),
                            onSettled: () => setLoading(false)
                        }
                    );
                }
            } else if (item.isDisliked) {
                if (reaction === 'like') {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount + 1,
                            dislikesCount: prev[item.id].dislikesCount - 1,
                            reaction: 1
                        }
                    }));

                    saveReaction.mutate(
                        { messageId: item.id, reaction: 1 },
                        {
                            onSuccess: () =>
                                void queryClient.invalidateQueries([
                                    'details-data'
                                ]),
                            onError: err => void message.error(err.message),
                            onSettled: () => setLoading(false)
                        }
                    );
                } else {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount,
                            dislikesCount: prev[item.id].dislikesCount - 1,
                            reaction: 0
                        }
                    }));

                    saveReaction.mutate(
                        { messageId: item.id, reaction: 0 },
                        {
                            onSuccess: () =>
                                void queryClient.invalidateQueries([
                                    'details-data'
                                ]),
                            onError: err => void message.error(err.message),
                            onSettled: () => setLoading(false)
                        }
                    );
                }
            } else {
                if (reaction === 'like') {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount + 1,
                            dislikesCount: prev[item.id].dislikesCount,
                            reaction: 1
                        }
                    }));

                    saveReaction.mutate(
                        { messageId: item.id, reaction: 1 },
                        {
                            onSuccess: () =>
                                void queryClient.invalidateQueries([
                                    'details-data'
                                ]),
                            onError: err => void message.error(err.message),
                            onSettled: () => setLoading(false)
                        }
                    );
                } else {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount,
                            dislikesCount: prev[item.id].dislikesCount + 1,
                            reaction: -1
                        }
                    }));

                    saveReaction.mutate(
                        { messageId: item.id, reaction: -1 },
                        {
                            onSuccess: () =>
                                void queryClient.invalidateQueries([
                                    'details-data'
                                ]),
                            onError: err => void message.error(err.message),
                            onSettled: () => setLoading(false)
                        }
                    );
                }
            }
        },
        [loading, saveReaction]
    );

    return { setReaction, setLocalReaction, reaction, deleteMessage };
};
