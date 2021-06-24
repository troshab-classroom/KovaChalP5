

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.abstractj.kalium.NaCl;
import org.abstractj.kalium.crypto.Box;
public class ConceptTester {

        private KeyPairGenerator keyGen;
        private KeyPair pair;
        private PrivateKey privateKey;
        private PublicKey publicKey;

        public ConceptTester(int keylength) throws NoSuchAlgorithmException, NoSuchProviderException {
            this.keyGen = KeyPairGenerator.getInstance("RSA");
            this.keyGen.initialize(keylength);
        }

        public void createKeys() {
            this.pair = this.keyGen.generateKeyPair();
            this.privateKey = pair.getPrivate();
            this.publicKey = pair.getPublic();
        }

        public PrivateKey getPrivateKey() {
            return this.privateKey;
        }

        public PublicKey getPublicKey() {
            return this.publicKey;
        }
        public static  void  main(String[] args) throws NoSuchAlgorithmException, NoSuchProviderException {
            /*ConceptTester ct = new ConceptTester(1024);
            ct.createKeys();
            String str = Base64.getEncoder().encodeToString(ct.getPrivateKey().getEncoded());
            String str2 = Base64.getEncoder().encodeToString(ct.getPublicKey().getEncoded());
            System.out.println(str);
            System.out.println(str2);*/


        }
}
