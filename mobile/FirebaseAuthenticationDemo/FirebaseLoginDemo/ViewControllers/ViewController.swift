//
//  ViewController.swift
//  FirebaseLoginDemo
//
//  Created by Ashlyn Chapman on 3/20/20.
//  Copyright © 2020 Ashlyn Chapman. All rights reserved.
//

import UIKit
import Firebase
import FBSDKLoginKit
import GoogleSignIn

class ViewController: UIViewController {

    @IBOutlet weak var signUpButton: UIButton!
    @IBOutlet weak var loginButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        setUpElements()
        
//        let fbLogin = FBLoginButton()
//        view.addSubview(fbLogin)
//        fbLogin.frame = CGRect(x: 16, y: 50, width: view.frame.width - 32, height: 50)
//        fbLogin.delegate = self as? LoginButtonDelegate
//        //fbLogin.readPermissions = ["email", "public_profile"]
//        fbLogin.permissions = ["email", "public_profile"]
        
        let customFBLogin = UIButton()
        customFBLogin.backgroundColor = .blue
        customFBLogin.frame = CGRect(x: 16, y: 116, width: view.frame.width - 32, height: 50)
        customFBLogin.setTitle("Custom FB Button", for: .normal)
        view.addSubview(customFBLogin)
        
        customFBLogin.addTarget(self, action: #selector(handleCustomFBLogin), for: .touchUpInside)
        
        
//        let gButton = GIDSignInButton()
//        gButton.frame = CGRect(x: 16, y: 50, width: view.frame.width - 32, height: 50)
//        view.addSubview(gButton)
        
        let customGLogin = UIButton()
        customGLogin.frame = CGRect(x: 16, y: 50, width: view.frame.width - 32, height: 50)
//        customGLogin.backgroundColor = .orange
        Utilities.styleHollowButton(customGLogin)
        customGLogin.setTitle("Custom Google Button", for: .normal)
        customGLogin.setTitleColor(#colorLiteral(red: 0, green: 0, blue: 0, alpha: 1), for: .normal)
        view.addSubview(customGLogin)
        
        customGLogin.addTarget(self, action: #selector(handleCustomGLogin), for: .touchUpInside)
        GIDSignIn.sharedInstance()?.presentingViewController = self
    }
    
    @objc func handleCustomFBLogin() {
        LoginManager().logIn(permissions: ["email", "public_profile"], from: self) {
            (result, error) in
            if error != nil {
                print("Custom FB Login failed: ", error)
                return
            }
            print(result?.token?.tokenString)
            self.showEmailAddress()
        }
    }
    
    @objc func handleCustomGLogin() {
        GIDSignIn.sharedInstance().signIn()
    }
    
    // TODO: put background video/photo in viewWillAppear/viewDidAppear
    
    func setUpElements() {
        // style selection buttons
        Utilities.styleFilledButton(signUpButton)
        Utilities.styleHollowButton(loginButton)
    }
    
//    func loginButton(_ loginButton: FBLoginButton!, didCompleteWith result: LoginManagerLoginResult!, error: Error!) {
//        if error != nil {
//            print("oops ", error)
//        }
//        print("Successfully logged in with FB")
//        showEmailAddress()
//    }
//
//    func fbLoginButtonDidLogOut(_ loginButton: FBLoginButton!) {
//        print("Did log out of facebook")
//    }
    
    func showEmailAddress() {
        GraphRequest(graphPath: "/me", parameters: ["fields" : "id, name, email"]).start { (connection, result, error) in
            if error != nil {
                print("Failed to start graph request: ", error!.localizedDescription)
                return
            }
            print(result)
        }
    }


}

