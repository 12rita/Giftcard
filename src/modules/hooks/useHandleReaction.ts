import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { queryClient } from '../../App';
import { message } from 'antd';
import { useSingleMutation } from './useSingleMutation';
import { ROUTES } from '../../static/routes';
import { IDetailsData } from '../DetailsDrawer/DetailsDrawer';

interface ISaveReaction {
    reactions: {
        message_id: number;
        reaction: number;
    }[];
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
    saveReactionGlobal: () => void;
    loading: boolean;
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

    const saveReactionGlobal = useCallback(() => {
        const reactions = Object.keys(reaction).map(itemId => {
            return {
                message_id: Number(itemId),
                reaction: reaction[itemId].reaction
            };
        });
        saveReaction.mutate(
            { reactions },
            {
                // onSuccess: () =>
                //     void queryClient.invalidateQueries(['details-data']),
                onError: err => void message.error(err.message),
                onSettled: () => setLoading(false)
            }
        );
    }, [reaction, saveReaction]);

    const setReaction = useCallback(
        (item: IDetailsData, reactionAction: Reaction) => {
            if (reaction[item.id]?.reaction === 1) {
                if (reactionAction === 'like') {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount - 1,
                            dislikesCount: prev[item.id].dislikesCount,
                            reaction: 0
                        }
                    }));
                } else {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount - 1,
                            dislikesCount: prev[item.id].dislikesCount + 1,
                            reaction: -1
                        }
                    }));
                }
            } else if (reaction[item.id]?.reaction === -1) {
                if (reactionAction === 'like') {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount + 1,
                            dislikesCount: prev[item.id].dislikesCount - 1,
                            reaction: 1
                        }
                    }));
                } else {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount,
                            dislikesCount: prev[item.id].dislikesCount - 1,
                            reaction: 0
                        }
                    }));
                }
            } else {
                if (reactionAction === 'like') {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount + 1,
                            dislikesCount: prev[item.id].dislikesCount,
                            reaction: 1
                        }
                    }));
                } else {
                    setLocalReaction(prev => ({
                        ...prev,
                        [item.id]: {
                            likesCount: prev[item.id].likesCount,
                            dislikesCount: prev[item.id].dislikesCount + 1,
                            reaction: -1
                        }
                    }));
                }
            }
        },
        [reaction]
    );

    return {
        setReaction,
        setLocalReaction,
        reaction,
        deleteMessage,
        saveReactionGlobal,
        loading
    };
};
