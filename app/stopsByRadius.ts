"use server"
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({

    uri: process.env.DIGITRANSIT_API_URL,
    cache: new InMemoryCache(),
    credentials: 'include',
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
            lat
            lon
            zoneId
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

}

