import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useDataFromServer } from './hooks/useDataFromServer';
import { ROUTES } from '../static/routes';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { api } from '../api';
import { useSingleMutation } from './hooks/useSingleMutation';
import { message } from 'antd';
import { JointContent } from 'antd/es/message/interface';

interface IUser {
    name?: string;
    email: string;
    picture?: string;
    isWhitelisted?: boolean;
}

interface IAuthContext {
    user: IUser;
    login: () => void;
    logout: () => Promise<void>;
    isLoggingIn: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
    const [user, setUser] = useState({} as IUser);
    const isAuthenticated = useMemo(() => !!Object.keys(user).length, [user]);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { data } = useDataFromServer<IUser>({
        url: ROUTES.USER,
        key: 'user-data'
    });
    const counter = useRef(0);
    const loginMutation = useSingleMutation(ROUTES.LOGIN);

    useEffect(() => {
        if (data && counter?.current === 0) {
            if (typeof data.data === 'string') {
                setUser(JSON.parse(data.data) as IUser);
            } else {
                setUser(data.data);
            }
            counter.current++;
        }
    }, [data]);

    const login = useGoogleLogin({
        onSuccess: codeResponse => {
            loginMutation.mutate(
                { token: codeResponse },
                {
                    onSuccess: data => {
                        if (typeof data === 'string') {
                            setUser(JSON.parse(data) as IUser);
                        } else {
                            setUser(data as IUser);
                        }
                    },
                    onError: error => {
                        void message.error(error?.message);
                    },
                    onSettled: () => {
                        setIsLoggingIn(false);
                    }
                }
            );
        },
        onError: error => {
            void message.error(error as JointContent);
            setIsLoggingIn(false);
        },
        flow: 'auth-code'
    });
    const wrappedLogin = useCallback(() => {
        setIsLoggingIn(true);
        return login();
    }, [login]);

    const logout = useCallback(async () => {
        setUser({} as IUser);
        await api.get(ROUTES.LOGOUT);
        googleLogout();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                login: wrappedLogin,
                logout: logout,
                isLoggingIn: isLoggingIn,
                isAuthenticated: isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
