import React from 'react';

interface Props {

}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log('An error occurred');
    console.log(error);
    console.log(errorInfo);
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
