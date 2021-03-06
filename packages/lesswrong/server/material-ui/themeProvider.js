
import React from 'react';
import { addCallback, getSetting } from 'meteor/vulcan:core';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider, createGenerateClassName } from '@material-ui/core/styles';
import lwTheme from '../../themes/lesswrongTheme';
import afTheme from '../../themes/alignmentForumTheme';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssCleanup from '../../components/themes/JssCleanup';

function wrapWithMuiTheme (app, { req, res, store, apolloClient }) {
  const sheetsRegistry = new SheetsRegistry();
  req.sheetsRegistry = sheetsRegistry;
  const generateClassName = createGenerateClassName();

  return (
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <MuiThemeProvider theme={getSetting('AlignmentForum', false) ? afTheme : lwTheme} sheetsManager={new Map()}>
        <JssCleanup>
          {app}
        </JssCleanup>
      </MuiThemeProvider>
    </JssProvider>
  );
}


function injectJss ({ req, res }) {
  const sheets = req.sheetsRegistry.toString();
  req.dynamicHead = req.dynamicHead || '';
  req.dynamicHead += `<style id="jss-server-side">${sheets}</style>`;
}


addCallback('router.server.wrapper', wrapWithMuiTheme);
addCallback('router.server.postRender', injectJss);
