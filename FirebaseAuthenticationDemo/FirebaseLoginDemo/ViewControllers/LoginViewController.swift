//
//  LoginViewController.swift
//  FirebaseLoginDemo
//
//  Created by Ashlyn Chapman on 3/20/20.
//  Copyright © 2020 Ashlyn Chapman. All rights reserved.
//

import UIKit
import FirebaseAuth

class LoginViewController: UIViewController {

    @IBOutlet weak var emailTF: UITextField!
    @IBOutlet weak var passwordTF: UITextField!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var errorLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        setUpElements()
    }
    
    func setUpElements() {
        errorLabel.alpha = 0 // hide error message
        // style login form
        Utilities.styleTextField(emailTF)
        Utilities.styleTextField(passwordTF)
        Utilities.styleFilledButton(loginButton)
    }

    @IBAction func loginTapped(_ sender: Any) {
        // TODO: valid form fields
        
        let email = emailTF.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        let password = passwordTF.text!.trimmingCharacters(in: .whitespacesAndNewlines)
        // sign in user
        signIn(email, password)
    }
    
    func signIn(_ email: String, _ password: String) {
        Auth.auth().signIn(withEmail: email, password: password) { (result, error) in
            if error != nil {
                self.errorLabel.text = error?.localizedDescription
                self.errorLabel.alpha = 1
            } else {
                let homeViewController = self.storyboard?.instantiateViewController(identifier: Constants.homeViewController) as? HomeViewController
                self.view.window?.rootViewController = homeViewController
                self.view.window?.makeKeyAndVisible()
            }
        }
    }
    
}
