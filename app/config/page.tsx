import * as msTeams from '@microsoft/teams-js';

async function initializeTeams() {
  try {
    await msTeams.app.initialize();
    
    msTeams.pages.config.setValidityState(true);

    console.log("App.js: initializing client SDK initialized");
    msTeams.app.notifyAppLoaded();
    msTeams.app.notifySuccess();
    const context = await msTeams.app.getContext();
    console.log("context-----",context);
  } catch (error) {
    console.error(error);
  }
}


export default async function ConfigurationPage() {

    initializeTeams();

    try {
      
      

      /*
      msTeams.pages.config.registerOnSaveHandler(saveEvent => {
        msTeams.pages.config.setConfig({
          contentUrl: window.location.origin,
          entityId: window.location.origin
        });
    
        saveEvent.notifySuccess();
      });
      */
      
    }
    catch (error) {
    }
    

    return <div>
        <h1>Configure your app</h1>
        <p>Configure your app here.</p>
    </div>
}
