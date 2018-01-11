import React from "react";
import Typography from "material-ui/Typography";

class LoadingMessage extends React.Component {
    render() {
        return <Typography type="body1" gutterBottom>Please wait while we load stuff...</Typography>;
    }
}

export default LoadingMessage;
