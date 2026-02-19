
const S = String.fromCharCode, n2cjk = n => S(n += n < 6400 ? 13312 : n < 27136 ? 13568 : 16896),
  Base = {
    e64(A) {
      var a = 62, b = 0, c, z = A.length, B = new Uint8Array((z * 4 + 2) / 3), C = new Uint8Array(64);
      for (C[a] = 43; a;)C[--a] = a > 51 ? a - 4 : a > 25 ? a + 71 : a + 65;
      for (C[63] = 47; a < z; B[b++] = C[63 & c])c = A[a++] << 16 | A[a++] << 8 | A[a++], B[b++] = C[c >> 18], B[b++] = C[63 & c >> 12], B[b++] = C[63 & c >> 6];
      return new TextDecoder().decode(B)
    },
    d64(A) {
      if (typeof A == "string") A = new TextEncoder().encode(A);
      var a = 62, b = 0, c, z = A.length, B = new Uint8Array((z + 2 >>> 2) * 3 - "0021"[z & 3]), C = new Uint8Array(123);
      for (C[43] = a; C[--a > 51 ? a - 4 : a > 25 ? a + 71 : a + 65] = a;);
      for (C[47] = 63; a < z; B[b++] = 255 & c)c = C[A[a++]] << 18 | C[A[a++]] << 12 | C[A[a++]] << 6 | C[A[a++]], B[b++] = c >> 16, B[b++] = 255 & c >> 8;
      return B
    },
    e85(B) {
      var a = 85, b, i, o = 0, z = B.length, C = new Uint8Array(124), A = new Uint8Array((z * 5 + 3) / 4);
      for (; a;)C[--a] = a + 38;
      for (C[54] = 33; a < z;) {
        b = (B[a++] | B[a++] << 8 | B[a++] << 16 | B[a++] << 24) >>> 0;
        for (i = 5; i--; b = b / 85 | 0)A[o++] = C[b % 85]
      }
      return new TextDecoder().decode(A)
    },
    d85(A) {
      if (typeof A == "string") A = new TextEncoder().encode(A);
      var a = 85, o = 0, z = A.length, b = z % 5, C = new Uint8Array(124), B = new Uint8Array((z - b) / 5 * 4 + (b && b - 1));
      for (; C[--a + 38] = a;);
      for (C[33] = 54, C[0..a] = 0; a < z; B[o++] = b >>> 24)
        b = 52200625 * C[A[a += 4]] + 614125 * C[A[a - 1]] + 7225 * C[A[a - 2]] + 85 * C[A[a - 3]] + C[A[a++ - 4]],
          B[o++] = b, B[o++] = b >> 8, B[o++] = b >> 16;
      return B
    },
    e91(B) {
      var a = 91, b = 0, c, z = B.length, n, o = 0, A = new Uint8Array(z * 1.24 + 2), C = new Uint8Array(a);
      for (; a;)C[--a] = (a > 57) + !!a + a + 33;
      for (; a < z;) {
        c |= B[a++] << b; b += 8;
        if (b > 13) {
          n = c & 8191;
          if (n > 88) c >>= 13, b -= 13;
          else n = c & 16383, c >>= 14, b -= 14;
          A[o++] = C[n % 91]; A[o++] = C[n / 91 | 0]
        }
      }
      if (b) {
        A[o++] = C[c % 91];
        if (b > 7 || c > 90) A[o++] = C[c / 91 | 0]
      }
      return new TextDecoder().decode(A.subarray(0, o))
    },
    d91(A) {
      if (typeof A == "string") A = new TextEncoder().encode(A);
      for (var a = 91, b = 0, c = -1, d, e, o = 0, C = new Uint8Array(126); C[(--a > 57) + !!a + a + 33] = a;);
      for (; d = A[a++];)
        if (d = C[d], ~c) for (c += d * 91, e |= c << b, b += (c & 8191) > 88 ? 13 : 14, c = -1; A[o++] = e & 255, e >>= 8, b -= 8, b > 7;);
        else c = d;
      if (~c) A[o++] = e | c << b;
      return A.subarray(0, o)
    },
    e122(A) {
      function g(c) {
        if (a >= z) return -1;
        c = (254 >>> b & A[a]) << b; c >>= 1, b += 7;
        if (b < 8 || (b -= 8, ++a >= z)) return c;
        return (65280 >> b & A[a]) >> 8 - b | c
      }
      var a = 0, b = 0, c, e = 8, n, o = 0, z = A.length, E = new Int8Array(256), B = new Uint8Array(z * 1.15 + 3);
      for (n of [0, 10, 13, 34, 38, 92]) E[n] = e++;
      for (; c = g(), ~c; B[o++] = c)
        if (e = E[c]) n = g(), e = ~n ? 194 | 28 & e << 2 : (n = c, 222), B[o++] = e | n >> 6, c = 128 | 63 & n;
      return new TextDecoder().decode(B.subarray(0, o))
    },
    d122(B) {
      function p(n) { n <<= 1, c |= n >> b, b += 7; if (b > 7) A[o++] = c, b -= 8, c = n << 7 - b & 255 }
      for (var a = 0, b = 0, c, d, e, o = 0, z = B.length, E = [0, 10, 13, 34, 38, 92], A = new Uint8Array(z * 1.75); a < z; p(e))
        if (e = B.charCodeAt(a++), 127 < e)
          d = e >> 8 & 7, 7 > d && p(E[d]), e &= 127;
      return A.subarray(0, o)
    },
    e32768(A) {
      for (var a = 0, b, c, i = 0, n = 0, z = A.length, s = []; a < z;)
        if (c = A[a++], n < 8) b |= c << 7 - n, n += 8;
        else n -= 7, s[i++] = n2cjk(b |= c >> n), b = c << 15 - n & 32767;
      if (0 < n) if (s[i++] = n2cjk(b), 8 < n) s[i++] = n2cjk(32768);
      return s.join("")
    },
    d32768(s) {
      if (!s) return new Uint8Array(0);
      var a = 0, b, c, i = 0, n = s.length - 1, z = 15 * (n >> 3) + n % 8 * 2, A = s[n] == n2cjk(32768);
      n % 8 < 1 && !A && z++, n % 8 && A && z--;
      A = new Uint8Array(z);
      for (n = 0; a < z; n -= 8, A[a++] = b >> n & 255)
        if (n < 8) c = s.charCodeAt(i++), b = b << 15 | (c -= c < 19712 ? 13312 : c < 40704 ? 13568 : 16896), n += 15;
      return A
    }
  };
export default Base