import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useIsAuthenticated, useAuthHeader, useAuthUser } from 'react-auth-kit';
import { loginPath } from "../config/InternalPaths";
import { connectionLostMessage } from "./Notifications";
import { useQuery } from "react-query";
import { pingServer } from "./fetchers/PingServer";

interface PrivateRouteProps {
    children?: ReactNode,
    element: JSX.Element
}

const PrivateRoute = (props: PrivateRouteProps): JSX.Element => {

    const isAuthenticated = useIsAuthenticated();
    const location = useLocation();

    const authHeader = useAuthHeader();
    const auth = useAuthUser();
    const token = authHeader().split(" ")[1];

    const { isError } = useQuery(['ping'], () => pingServer(auth()!.username, token), {
      refetchInterval: 1000,
      retry: 3
    });

    if(isError) {
      connectionLostMessage();
    }


    if (isAuthenticated()) {
        return props.element;
    }

    return <Navigate
      to={{pathname: loginPath}}
      state={{from: location}}
      replace
    />;
  };

export {
    PrivateRoute
}