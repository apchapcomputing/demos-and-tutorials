//
//  ContentView.swift
//  SwiftUIDemo
//
//  Created by Ashlyn Chapman on 3/25/20.
//  Copyright © 2020 Ashlyn Chapman. All rights reserved.
//

import SwiftUI

struct LandmarkDetail: View {
    
    @EnvironmentObject var userData: UserData
    var landmark: Landmark
    
    var landmarkIndex: Int {
        userData.landmarks.firstIndex(where: { $0.id == landmark.id })!
    }
    
    var body: some View {
        
        VStack {
            
            MapView(coordinate: landmark.locationCoordinate)
                .frame(height: 300)
                .edgesIgnoringSafeArea(.top)
            
            CircleImage(image: landmark.image)
                .offset(y: -130)
                .padding(.bottom, -138)
            
            // Text Views
            VStack(alignment: .leading) {
                
                HStack {
                    
                    Text(landmark.name)
                        .font(.title)
                    
                    Button(action: {
                        
                        self.userData.landmarks[self.landmarkIndex].isFavorite.toggle()
                    
                    }) {
                        if self.userData.landmarks[self.landmarkIndex].isFavorite {
                            Image(systemName: "star.fill")
                                .foregroundColor(Color.yellow)
                            
                        } else {
                            
                            Image(systemName: "star")
                                .foregroundColor(Color.gray)
                            
                        }
                        
                    }
                    
                }
                
                HStack {
                    
                    Text(landmark.park)
                        .font(.subheadline)
                    Spacer()
                    Text(landmark.state)
                        .font(.subheadline)
                    
                }
                
            }.padding(20.0)
            
            Spacer()
            
        }
        .navigationBarTitle(Text(landmark.name), displayMode: .inline)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        LandmarkDetail(landmark: landmarkData[0])
    }
}
