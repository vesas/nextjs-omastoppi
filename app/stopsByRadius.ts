"use server"
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({

    uri: process.env.DIGITRANSIT_API_URL,
    cache: new InMemoryCache(),
    headers: {
        "Content-Type": "application/json",
        "digitransit-subscription-key": process.env.DIGITRANSIT_API_KEY
      }
  });

const GET_STOPS = gql`
  query GetStopsByRadius($lat: Float!, $lon: Float!, $radius: Int!) {
    stopsByRadius(lat:$lat, lon:$lon, radius:$radius) {
      edges {
        node {
          stop {
            gtfsId
            name
            stoptimesWithoutPatterns {
              realtimeDeparture
              headsign
              trip {
                route {
                  shortName
                }
              }
            }
          }
          distance
        }
      }
    }
  }
`;

export async function stopsByRadius(lat: string, lon: string, radius: number) : Promise<string> {
    
    console.log("Hello world!");
    console.log("component: process.browser: " + process.browser);
    console.log("lat: " + lat + " lon: " + lon + " radius: " + radius);

    const result = await client.query({
        query: GET_STOPS,
        variables: 
            {
                lat: lat,
                lon: lon,
                radius: radius
            },
        errorPolicy: "all"
        
    });
    
    return result.data;
    /*.then((result) => { 

        console.log("data: " + JSON.stringify(result.data, undefined, 2));
        return result.data.stopsByRadius;
        // console.log(result);
    });
    
    return result;
    */
}

