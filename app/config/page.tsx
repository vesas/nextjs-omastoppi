import * as msTeams from '@microsoft/teams-js';


export const getServerSideProps = (async () => {
  // Fetch data from external API
  // const res = await fetch('https://api.github.com/repos/vercel/next.js')
  
}) 

async function initializeTeams() {
  try {
    await msTeams.app.initialize();
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
      msTeams.pages.config.registerOnSaveHandler(saveEvent => {
        msTeams.pages.config.setConfig({
          contentUrl: window.location.origin,
          entityId: window.location.origin
        });
    
        saveEvent.notifySuccess();
      });
      msTeams.pages.config.setValidityState(true);
    }
    catch (error) {
    }
    

    return <div>
        <h1>Configure your app</h1>
        <p>Configure your app here.</p>
    </div>
}
