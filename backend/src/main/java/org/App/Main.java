package org.App;

import org.App.Utils.App;

import java.io.IOException;
import java.lang.reflect.Field;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;

public class Main {
//    private static class Idiot{
//        String[] str = new String[]{};
//    }
//        for(Field f:Idiot.class.getDeclaredFields()){
//            System.out.println(f.getType().getSimpleName());
//        }
    public static void main(String[] args) throws IOException, UnrecoverableKeyException, CertificateException, NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
        App.run();
    }
}
