//
//  ContentView.swift
//  SwiftUIDemo
//
//  Created by Ashlyn Chapman on 3/25/20.
//  Copyright © 2020 Ashlyn Chapman. All rights reserved.
//

import SwiftUI

struct LandmarkDetail: View {
    var body: some View {
        
        VStack {
            
            MapView()
                .frame(height: 300)
                .edgesIgnoringSafeArea(.top)
            
            CircleImage()
                .offset(y: -130)
                .padding(.bottom, -138)
            
            // Text Views
            VStack(alignment: .leading) {
                
                Text("Turtle Rock")
                    .font(.title)
                
                HStack {
                    Text("Joshua Tree National Park")
                        .font(.subheadline)
                    Spacer()
                    Text("California")
                        .font(.subheadline)
                }
                
            }.padding(20.0)
            
            Spacer()
            
        }
        
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        LandmarkDetail()
    }
}
