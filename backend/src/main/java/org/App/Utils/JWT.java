package org.App.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JWT {
    public static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    public static String createJWT(String username) {
        //keys.put(username,key);
        JwtBuilder jws = Jwts.builder().setSubject(username).signWith(SignatureAlgorithm.HS256,key);//.compact();
        long now = System.currentTimeMillis();
        long future = 1000*60*60*3;
        jws.setExpiration(new Date(now+future));
        return jws.compact();
    }
    public static boolean verify(String jws){
        try {
            Claims sbj = Jwts.parser().setSigningKey(key).parseClaimsJws(jws).getBody();
//            System.out.println(sbj.getExpiration().getTime());
//            System.out.println(sbj);
//            System.out.println(System.currentTimeMillis());
//            System.out.println(sbj.getSubject());
            return sbj.getSubject() != null && sbj.getExpiration().getTime() >= System.currentTimeMillis();
        }catch (Exception e){
            System.out.println(e);
            return  false;
        }
    }

}
