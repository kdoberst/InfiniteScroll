import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { HashRouter as Router } from 'react-router-dom';
import { AppLayout } from '@app/AppLayout/AppLayout';
import { AppRoutes } from '@app/routes';
import { LoadingProvider } from '@app/infiniteScrollDemo/LoadingContext';
import '@app/app.css';

const App: React.FunctionComponent = () => (
  <Router>
    <LoadingProvider>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </LoadingProvider>
  </Router>
);

export default App;
