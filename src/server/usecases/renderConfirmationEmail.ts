export default (appUrl: string, confirmUrl: string) => `
<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Email Confirmation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }

    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }

  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }

  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }

  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }

  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }

  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }

  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }

  a {
    color: #1a82e2;
  }

  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
<!--  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">-->
<!--    Verify Email Address-->
<!--  </div>-->
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="${appUrl}" target="_blank" style="display: inline-block; text-decoration: none; color: #1982E2; margin: 0; font-size: 45px; font-weight: 700; letter-spacing: -1px; line-height: 1.3;">
<!--                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' id='Layer_1' x='0px' y='0px' width='182px' height='46px' viewBox='0 0 182 46' enable-background='new 0 0 182 46' xml:space='preserve'%3E %3Cimage id='image0' width='182' height='46' x='0' y='0' href='data:image/png;base64,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 RU5ErkJggg=='/%3E %3C/svg%3E" alt="Logo" border="0" width="200" style="display: block; width: 200px; max-width: 200px; min-width: 200px;">-->
<!--                <svg style="display: block; width: 200px; max-width: 200px; min-width: 200px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="182px" height="46px" viewBox="0 0 182 46" enable-background="new 0 0 182 46" xml:space="preserve">  <image id="image0" width="182" height="46" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALYAAAAuCAYAAACFxeMqAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAA CXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH5AgDExYZBVcXJQAAAAFvck5UAc+id5oAABUtSURB VHja7V17eFTVtf+tfWYmEeRREdFCfeIbgSQlM+ckcbCAYqX2+ohvrw8E2waserXaqhdQa/tpWx8g WtF+vfgoGitqq0V5piTnTICAUOXzfdWCVR7ykkdm5uzf/SNnkpNDJhkC3HzU+X1fvpm991prr7PO OrP3XnvtE8E+RvyqhYU7e6gjdqV1d8OQHlTpLcoIb1r+UPxf+7qvPPLIBtlbASUT5pxERs6iIA6y SIAjIaKCdAR3COUDCBwCi8Ky629Lpn5/a1cbII9/T3TKsQdOfL2gpy68CsLrABnWGRkkdwrwqlBN a5h+Rm1XGyKPfy/skWNXVr5gfNj3kB9D5BcicsS+U4OLtNI/e+uRUUu72iB5/HsgZ8ce8pOFQw3h kxCUBNsIpgDUk1wkgvfoyscIcTMAKK0NIPRtgRyjRReBMkIEx+0uAy7Ax93N6dtWPXPW9q42TB4H NnJy7OKqBeMpfFgghf56kisE8viuXckXVz81+qtcOy368bzBUOoKAcdBpHerRmI1tb50xWMjV3W1 cfI4cNG+Y0+apIo3nv4AIDe3buCHAt7aMG3EK4Cws50P+enC3oarbwHlFggKmqWT22DIeSse+d78 rjZQHgcm2nFsSnHVghkQGdtSRQ3igR7b1eSa/zlj175SYugNbx4vrvGMiJT6+kpq4ry3po94vauN lMeBh6yOXVS14FciuD1TJrBNKV7S8Mj+cbRTJr0dKdzw5SMQud5XvR2SHrl86pmJrjZUHgcW2nTs oRMXXqjI6uYKcj3A0csfHbm8PWHDhg07IRQKHZ5Op99funTpF51RaOiE+XcpyN2+qrVaQkVvTT19 fVcbK48DB7ttpAyeUHOMaP2Ur2q7KxzTnlNXVlYalmU9Fw6H3xORmlAo9GksFruuMwq9NW3EPYT+ ja+qvzD9h642VB4HFnZzbIPpqSLSM1MWcNzKaSOXtCdk7dq1pQAuJXmXUipGcqFSalJnlVrRZ/Ft IOe06IAxxRPnX9TVxsrjwEErxy6umjtGRM7JlAk+2TBtxJ9ykPMtAHBd96Xa2tp6EVkFINJpraZM 0ZHIQZeD+LK5jvK72E3PH9TVBjtQYFnWibFYLG5Z1oldrUtXINS6aPw8843UG9K64GddpVjiQeur ogkLbxHwaa+qfzLZdzyAh9vjsyzrRJKDAeyIRCLza2pq9ln0Zk8RjUaPV0oNVUq9X1dXt3Jv5ZWU lHQrLCyMu647VCkVAbBNROy6urolAHSGzjTNswDMUarpd6usrOzMurq6uV1lh65As2MXT1hUAWgr Uxaoe//xWMWmrlRuxbThzxZVLbhZRIoAgMDNlZUvTKuuvshti768vLyv67orRaQAAJLJ5EwAV+0P 3aLR6NFKqd+ISB+SH4nITbZtb8u0x2KxQ5RSKwEcRDJVXl4+qLa29v3O9FVeXt5Xa/0LkuNIds84 LACQhGVZn5K8z3GcJ9Hk4K3yd0gOBfCNcmzfVERf7bPEukhk/RN7I5hkd8uyJlmWNck0ze91TooQ gnubS4IjP+rXJ56NWms9MOPUTfRy8n4znFJXi8gFAIaLyFiSYwLtxwLITJ3CrusO7kw/ZWVlZ7uu uxrAjSLSPQvZUSLye9M0X/Ku29hf132gQAFAyfhlYZIXZipJeS7x4MU790awdxMmA5gsIvMty7qi M3J69lGvktzQrBvk0my0WuvOz+v3HN38BW9q0Ix0Op3yl0m6uQj1o6ys7Ada61dF5NAcWc5CGwGB byIUALjGlmGtIiE6/fw+kL3Otm2xbdsguRjA05Zl0bKs7ZZl/SpXITVTzkiLyIvNupEju9pouSAU CrWKu5Pcozh8RUXFESSfEZFQQM5HAB4meR+AWSSb1xAiMg2+ufY3GU1GM9TpQFPKB8FNAzeOWrp8 b6S2hgbwEYATAUwHcByA203TPEVEGgF8pLW+O5FIZB0h6HKuGPIjAIDI0SXj5x7Z8MSoz/alIUaP Hl2wdevWa0ieLyKnAAgDWAdgQTgcfrCmpuYToGlubRjGXQCKWulIXmma5vdFZJeIPFZXV5cwTXOj iPQBwMLCwrcBwDTNkwDcAMAUkW+T3CUin5D8i9b66fr6+i8BwHXdmwH09MnXInKr4zgPwee8paWl A0Kh0J0ktyaTyTuyXV9ZWdkQrfVYAL0ArA6FQjMXL17c5qmmyspKY+3atZcCuJrkEBGJkPxERF4K h8MP19TUbG6LLxqN9lNK3QzghwAGiMjXAJYBmGHb9qvIOJmHWCx2EIDrReSHInI8mvzxc5L1Sqln 6+rqdsvTLy8vj7uuO05EogB6ktwhIssBPGXbdvOueAgAFPWpkKZNSAHqq6ul3WEzFoudJyIXA4DW +vFcHIfkesdxppSWlh4TCoWuFJETAHwJ4D8Mw9gB4J5svCHZabu+kd+NyKkA9pljx2KxgVu3bp0N YJBIq83YwwAMSiaTYy3LOt+27TcNw5gA4No2xIzI8GqtTwQQA9AA4EyS79fU1GwuKyuLkZwP3zTG 4zlSRE5XSt0+atSoo+bOnbvde8D88u+xbft3wU6XLFmyBsCPOrjEs0j+UkTCmYp0On2HZVnX2Lb9 Zz9hPB4/dM2aNdUiMtynH0RkMIDByWRyvGVZF9q27fj5ysrKztZaPyetszW7AzgHwDmmac7evn37 latWrdru9RNKpVLzAFgBXfuJSBHJH3n6/REASkpKwuFw+HGt9bV+u3jfjwZwvmma0xzHmQh4UxEC J2QISbS7cq+oqDhGRKoBFItImWEYC0je6KfRWs8l+YCv85fR9GsNkaZsQBH5tW3bwwHUaK3L2+tz 6fQxXxDYkikrqOOxj+BFL+YCGJSNRkS6k3w+FosdQrJ3DmL7eJ+vep+vNNmWdyIwNw8g2bt3713R aLSfiBzbck+4KxKJPLQXlzkCTSOQ/5p6kJwVi8WaF+OxWOygVCr1esaps9ji2wD+5o08Gb641vpl CaYgt+Y7r1u3brPgpXGkUqlzsLtTt4J/bRWJRKYrpa5tj15EJpimeSXQstDo29xIrGmP2XXdASJi aK2v3bx583EknxaRUX6a+vr6uY7jNG+L27b9iuM40z1+F8A639ywUUQ6XvQRa32FwzqkzxGGYdyJ pifeb9CVJF8i2fwwiUhvpdR1IrI6B7ErAaBXr15PkrzbMIxfe3JP8tG8rbUuJxnXWt9DcplS6qrq 6mpXRILX93G24X9vICIhEXkELTlDExEIFWZBL28+j8rKSgPA47ncQ6XUmFgsVgkAWutTAjYfS7JU a30VybkAHnUc5zUAKCsri4nIdQH6Dd49anU/ROQmwHNsgfTytWxBO9BavwMgZRjGhatXr046jnMN yVeRI5YtW/ZP27b72ba9RwtUkRYno6DHnvC2J5bkZQGDPeA4TrHjOBcAGBegH9S/f/+HXdetADAr 0PZrrfXZWutRJK8EgDlz5jQ6jjOptrZ2k2d0/+HlE0XkSpIDlFLPOo4zLLOJopRKBm7Wvoh0/AHA JQB+C99cV0QGR6PR07zvwZj/GwAGaq37kPxloO17FRUVR6xZsyaqlGp+YL21wMRwONxDRIaSXOZn Ukpd6fXVys+8kGmZiHwSiUTOtW17QkZPrfVlgb7fjkQiJzuOcwHJ75Lc5ms7tbKy0gh5t1eaH1pp /+BAIpH4yrKs35K8taKiYubixYuXi8jvAZy7D4yfHRQ2q0hjr0/XA0A0Gj0MQL9AtWFZ1l0AQHJ4 KxXIHdXV1S6AWtM0zw3M9d5NJBJz2uuP5JzMZhOAsIhcL16armVZK0Tktrq6urmNjY1fRCIR7XPo 48rLy/vW1tZ2KsOR5HOO42Ty6p83TfMEEflB8wUbxuB4PP5+KpU6xcejDcO4NPNQArjTNM2zROS7 mUtOp9ODvbWSHy/W1dVN876vtCxrHIAVPrmDvc83Abi+mLullLIAIJVKbTRN8/fJZHJyQ0NDSkRO C1zPF6lUqsqyLGit+4rIwb62xurqalcBgEbLLwnJDn8NGxsb7wHwaTqdfsIbivY/BC3KS6sndG/Q M1ghIjejJf4+3GcXrZSalbPkNhCJRO4H8HaW5iKt9V+i0ejJDQ0NWwD4A1Nh13X/u9OmE3nLXyb5 XqDcE0BhgG17bW3t5kDduoDcQrRsQmXqPm+PB94aI5FIfCgi2QIGfUTkFwUFBVO8crCPkfDukVKq Cq3Tr58DvKmIAja0MLF/R4ZqaGjYAeAnIlKyZs2aCSTfIVkViUT220txSA7wfc/5fGUHMr8kGYz7 zgLwaODvNyJSXldXt8hn3CBfITpATU3NZq11qbfY/gcC4S8RKVBKZTayngm0TTBN8/7S0tJWD6OX 7DQ7FovNjMfjHergydptVK6pqdkcWFP0ME2zedOuvLz8BAAVAbZPtdafBGx6bnl5+bd85bEBnmZ6 27anKKWGA3iN5G4HuEmOy9ynQNPS4D0iOU1rPW7AgAFVgBfu0+AHCtJ0+pzIKeLgOM4blmXNAnCP 67p/XrJkyfRc+DqD2E32IcnUrkOajU5+kCPrQaWlpacEK0WEPXr0+HzevHlbTNNcgqbQXMaYYRG5 z7btz0ePHl3w9ddfx9LptGUYxlq/DJKb/FMRkj+1LOtwkg2O4/y1LWUsy7qc5C0kXzYMI55Op0Up 9X0AT/t0O9yT9wSAn4rIMb62W0Oh0FjTNGsBrPNiv5ZSKgwAjY2NXwK4dS9M/VcAl/vKf7Is61IA 21zXPU9EmkdzkuuTyeQ74XD4MwBb4Y1+InKs67rvmKb5GoCBbURYFgDAsGHDDg+FQi+6rrtWRCYn k8mV4XD4NBH5g4gM8WQdWlJSEhaReWg91T1MRGZl4tyWZZ0oImcC+Jc3Vcz8YqvmlSVFSgHmNIdN pVI3AXCVUtNyoW8LJMMd0aQad8b8ZSOs3+6Ix8OgUCj0TvDPMIzVO3bs2OQ52v1+Bi//Y61pmtu2 bt26S2u9SCl1H8kXA3QrAn2djKbpy6vl5eXHBhUpLy//FslHRWSoUmqy67r/FJHXSAaH43UA4G1Y XYAmp/HjEBE514sSxOEL40nrY3V7DMMw7gawwyfPAHAegP/0O7XXNqmhoSGVSCS+AvBIoO0IEbku 6NQkN2itfwcAoVDoXhEpE5GLACwtKChYqZR6DL6wK8mNDQ0NqcbGxpn+0B+Ao0gutixru2maLoB3 ATwiIrO9kaXJsbXw781KAf2KbljcarKeDUuXLv2C5O1KqR+WlZWdv6eGjMfjvQGcDqDdM41smlN5 Baxd9tCoj9uk820v5wARkWgikZhNcmYbjQcHqoaVlJQ0R4/69+8/n2Rbqajiuu7hwUqt9UkiLdEn EekuIjEROdqnf5rks5my4zgrlFIVaLpxueB5T84e5aVkpia1tbXva62vAJBqj57kDNu2H/PZYjLJ 2R3w7BKR8zM7q9g9rHgygNJAAtfTANDQ0LBFRK4jmQ7wdAtEjMKu6w4HPMfutVXqSbZsabupi3M1 SiKRmAHAJvlwcP7XEZLJ5GVeNt4fs9FUVr5gUFoStAAszEZrGMZq7L5YyQqt9YcAMGDAgGtJ3g0g +7Y+OdNb1AEAqqur3XQ6PRpN+Rp+g29Np9PvBflt23a8cNoHWeR/JiJXOI7TajSqra1dFQ6HiwDc ke3aSK7UWl/sOE4mPOlk1g6eky8LsNhomd+ntNb1mQbvQS9D68Vrpp/1JCc4jtNqZKiurnYHDBhQ SfJ2kpva4KslWWrb9uJMnYhcRPKVLA/hTgBP+VMEbNt+BcCYbPbz+vnIdd3XAd9qsrhq/ix42+Qk /6lSvY5reOK77T65GUSj0cGGYSwj+bjjODfkwgMApmk2iMhO27az7jwWVy04C4LmMBpdfe6Kx0b+ JRt9PB4/eNeuXad6K/asMAxjQ11d3Wr4FnCWZfVA0xb4QBEp9JxjDQDHcZysv5olJSXdIpHIsST7 APiHNzxng1iWNUREhmitu4vIRtd1P6yvr1+OwGIyCC+HoxTAIJJhkl8DsBOJxIdB2oqKiiOSyeSR qVTqs+XLl++2qI/FYv0Nw/iO1vpjx3HafGBM0xwEoEgpFXFd99OCgoJFNTU1abSDeDxemEqlTgdw FIAd3pojq+2i0Wg/wzCiXjx/u9b6i0gkUldTU/N1FhZlWVZURKIkewFN6x2t9arCwsLajH7Njl00 ceFoIf+WKbua41dOHzEDOcI0zfsB3AxgmOM4KzqiLysrG0LyLa31dYlE4qlsdMVV82shUoamK1gv qV79c33g8vjmonl+smLq8Df825NKcOfgK97onqugUCj0oIgYSqmcEuq11mNJfq2UeiEbTXHV3DHN Tg0A5EN5p84jF/hyfYWU+feKF+AWkSNDvUL/DeC2XARl5pkkT/In1mShFRG5nOSL/uNUfpzyk4UH N70v0OMBNh7UvXBqVxssjwMDgbAepbhqwWLf0K+hQmcvnxp/syNB3rm8nBduTeIZdxzn7221FU2Y /4xALm+h1T9e8ejInFJk88gjcEpdqGV+lSKXQCQCEUWmny2ZMKeiYdrodkNOO3fu3BwOh4fn2rGI 0HGcxW21Da2af0trp2Zi4LqvZnQ4cc8jDw9tbsQUVc2f6KUzZvBpGsYZq6bF/3d/KzR0wryxCjID mZMP4KawoYrrHz7jk642Vh4HDtpMh1zx6IipJP/oqzrKYLquuGpe8f5ThVJcNf/nfqcmkNIwLs87 dR57iqxb55WVND7st+BlgbS8VoBoBPR/LT908WOYMmWfHRodOvHvfRWTTwKqJR+A1FS4esXUEU/v heg8vqFoNyekZPyyMENbZkLJJa1b6Ah4Y0MH7/TrCCXjl4UZ3joewnsAackIA1MErnort9er5ZHH bug42WnSJFW0IT5ZwDuC/+aOwtdEq8d7HIo5NVPOSHcoy8OgG+b1i7jqEoI3+nMlAIDkvzT0ZSsf HbWoq42Tx4GLnE+iDJ0wd6SimoGAIwJNMWYh51FkIQXvhtLJj0UZO7YfesS2yFdf9TLo9iHTAwGj mMBIgGbwfRlNcjibEr4+/y7sPPYWe3TEavAVb3QP9Q79HJAb0XS0fp+A5LvQ/Fl7OSB55LEn6NTZ wWFVc/ukRd0AyDUCfKdzXZMk6oSYetz6jX/O9qLJPPLoDPbqUGxl5QvGR/36xEkZLYLhJE9rN6uu 6TVfCUIWhcWYveT/IS6exzcT++S0dzMmTVJDvogdqYxuR1KxuwH3YLrGhrToHT0Zfr+2i19LnMc3 B/8HhNttj3Y39HUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDgtMDNUMTk6MjI6MjUrMDA6MDB6 62U9AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA4LTAzVDE5OjIyOjI1KzAwOjAwC7bdgQAAAABJ RU5ErkJggg=="/></svg>-->
                Let'sChoose
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="${appUrl}">Let'sChoose</a>, you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href="${confirmUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Confirm Registration</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
              <p style="margin: 0;"><a href="${confirmUrl}" target="_blank">${confirmUrl}</a></p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Cheers,<br> Let'sChoose Team</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start permission -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">You received this email because we received a request for registration for your account. If you didn't request registration you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end permission -->

          <!-- start unsubscribe -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
<!--               <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p> -->
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Let'sChoose. All right reserved</p>
            </td>
          </tr>
          <!-- end unsubscribe -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
  <!-- end body -->

</body>
</html>
`;
