import * as msTeams from '@microsoft/teams-js';

export default async function ConfigurationPage() {

    msTeams.app.initialize();

    msTeams.pages.config.registerOnSaveHandler(saveEvent => {
        msTeams.pages.config.setConfig({
          contentUrl: window.location.origin,
          entityId: window.location.origin
        });
    
        saveEvent.notifySuccess();
      });
      msTeams.pages.config.setValidityState(true);

    return <div>
        <h1>Configure your app</h1>
        <p>Configure your app here.</p>
    </div>
}

