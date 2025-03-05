<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Team {
  name: string
  owner: string
  logo: string
}

const teams = ref<Team[]>([
  {
    name: 'Chennai Super Kings',
    owner: 'N. Srinivasan',
    logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAACUCAMAAADvY+hPAAABWVBMVEX///8dQYwArPD//fwYUpxcbKITPIoaS5UWWqPxSwAUY6sJjdILg8j+9/XxSAD7/P1aib4Hldn96uQOeb/yUwAAarf2ihEdY7cAZbMSa7IAWLP3lg8AMYX84dkAW7Tn7PYAUrHY4e/wOAAAS6+Qn8H6y72YsNf1gRPf4+yGk7k7TpK6wNVmdadIYJv72M54lMv5vq1QfcH2m4LyXBmpu930awDM0uH1jGzzZzH1dgAAoucAKoP4sJ/0e1n3o4vCz+b0dUnzaUA8cr0AQqz4ngAAIYDyVyz2knjzb1P3kzT96tr948qhrcoAF313hrH0gGYABKCMoNAAL6cAOKllh8T2j2H1hFX0fkX2mW/6xKb4rIT5v5f4pnL0dTj3mVH3m0T81Kz5t3j1fi9wnMr5rV/4pTv5umH7xon7xXb6rQD6wlr6tyv81YH7wwD7yEj+7r/93Wj81kAAAHiBI58SAAAbcklEQVR4nNVc+1+b2LYng0bRbGgJU40NxmDQxChF0BArINhWWpOa651Op48Zm07baedxzpx7/v8f7toPCElItHU67axPa9iPwHevvfZ67U047u8g/m95yl9KsvqlEVyJZHlwrTr/CD7rbnLJu6I8pefXQiiKkmu5p5lj7XrM+K9lAmRT8BC7Rq4i+CPtyFB0dql/HYJuuLZoG/Sa1wNRGRFm2fS0iFbJkfN3oxsiRGQWQNriU5EJsxGIthWiVCfD99qKGJAq1WqffFFBNxyMKNKEni57BLKs21rg6p6MZFk1dNN32qKmieFT2+d42XDbmtD+opLhBrzseprtGpwe6niRWbZo6chUnAg4q2ES7cBxdTdwTL93orQVJTS+IGI58GTLFgId8WpoycgMTk48XdattmK3AachI0wy1Dw8OQkcH9oUwfuSgmHatm+Lno6567lmWwt9XdUd7cRxjYEwy7obubpKgBqOFroT7/fZCXGubduCoCPOdH3HE0TLQLIfasDoIYUhJ0XdETT/yzEZ+chyIkWJgJ+y4Qiho2IVprUtNOELWCpCd0Jr0uszSrrqGb6jiqIPLASl4ZkytiKC4mZxEamG6Ua2GLgymm7+kPX5FIoammbA9URs6BwxJMIrB1o0jlh1HS9o24qgwKoMwjDwvJ5l6moWv5H5GWVdPbGMNmcI8ATd7hHW8KYWjMyrbPg/gaITBcW224wAvCBi0sS245uGKoNm4XkEihw0pjZq7P9CChUZdLHfA/UcMjfI1/xh1hlWAJbEBmC6bhgqI0PXQUwCBQYCBH/bgRNFUS+AxawIUcaz/iKyRN+xQHxlzo9dIk8YcuF4M1QEe5L88qCxdbDlJzbgFggpbdtWrM/n6+m2EoC/wPOczzwd1DtJywUCTa045qVKTTZ01/cty/Jd020rn1EwkKe0BQtf6QFjjGOnl7sBgulmLrKJBMrS1i/v9smkg5MpYkTqCUMahSmWIktrT9TCPDHlwyLAyzAttvVZsBJSDRDdpxH2jHmHPcdMQ5a9CZZOBh3tWw4mLAuxtpNNCxD7n9HPM0KEFMH08IIzHtKnqmnBUG076/GyH7QVquQYKXbouYbpheBU65/TnKPQ4UxFkCMsex5bdmlfWNbG1z6v+oIWepEFbh6oY5k41a7leKGgaYqdaTn/QnIhKHUUDxkAEwW0zk+tHdk2xyAbPcExwScduxkCafFDUQwj93NGAKLnqrbikqDZp2w2UpB5byzOlqPAnKZBENIdkBrbNyZ4Iki+ntJ2RTeIlDadTIqVTzPQHfMWePcqfpru9gTQHPrY4CBUcKYO+VJS2wqYN4Ua2IzRozEuXzmJgVTT1sQgSq1GHryrTK/rYwjbEh9ips9lYJEb2BA8tp+CNnzaxqpFaF/Tm0aRYLfBB/6MTjlvuI5NHEFwXCEEcq6pUowAe8CO8YnSxSc0vR84paYF/jZ4TIJ7rRmVdU+ze1daT9lIzOj7ABP23nD0naX7hshoX29CkRtqbfNTOUzuIGPXHsksR+OJ2olnmZO1Mvgs15IL2RcUz5g6TTx4w07wMHiK8xdXGBoPbpHTtgUsahk3ln2lfR0nD/kKxP6psjo+fiMSeyZ2eZCq+5Y/7j1Ie3sZt4YFl6GVke6Ltn8dnYx6gpgK/mVznI/IEdtpZxmNc7q6/l098+6yK2hK4Ce8BqMYatfMgPCRoCSGAuKh8WWBXFG5PFZuHk1sMnq2KEYG9poCRQi9aycLTBBlxgRelTOGL0eafV2FbfjYSfV8HIVfy04TUhVbYLKsZypLNRSDq/ClLk1tliNQ/X9NaIUCRWmTC8PzsjqoymArIosqMdS91iWPUiO81K/pFajgn0cwZXjiTVMPs5aF0RYy6xNaOqegpScbcVVlQlfeCDXlOg4Rcm3xJHQgapPhZo7B2VnYLNCvUx+SqLjW2iqrWbozsTdvtgVhPGS4GsmurfXiiMeIsCA7QmCCvR3Z0jGuuMQrxytrDP3eZAUCN3QE4ZNYrUIYHMZ2mrcog+W2h4POh1d1wGM5rmKIreO1O8dLR+n6CcTrgtD+GNCy4VqWo2hCGK9gZGo4G4AMWQ28SDWsHnSwxu85bkT2/ofakOrK8e7q2uodrrK+/uSodR6bw4nYwUcXxiOHCYDNCEJ3U8ck46Lvu76jEQUnm6bjy/7EXJY5breq5/TzaHVpdWlp6XjvDlysrTEJke40JwIBGzW2E5pFvOGdhGbCLWR6HrgPemp3CRmOkyUVPK/6YWZin/C5crxEaXWVfjD18d35FCExbKF3mXwgPdQigo4sMcO3ifn0tWiq7PI4L+SB6si2BdWNavXoGENdXVnDTF7BoI+ruE3KUnh8glMNRGW6bTU9jSVXiIPlij1S8jOSK2STAUuPoco8bzqR4uoTI/nzVYp4/XjjqFVtHW3srgP04z1J2sv0l1JJBxlCIn+y0jNC0aYyz/sDXiOki6mcH87CgwvjBTj/rSYyJPvTzG2FQr4zAFi5A8K9urK+MeEbarIuELblExQp8kWRmAVeNaOB5JuOISdKDRlu5DmRa476LwbTL2jCCYGjNczWoarWk5Wl1SeTlYYfqwyIlxUl0yXlfUHA3rXqByeJ5nUfOsZg7ZlW2I50NSOacBWZBMpe9hoEOl47HhVc6Xx9bZL1xoDceHMCgZFVwox5lEPsHKueJvbYY8FffxjLMTJA1MMMdUzID0GA4JuiN1FAqk8yKs+zIpYBGcntTBAPsT2WWuIjG6sWRWGHFpAZDKQYAGvOeDYqbg1lMxTB7Zvii0mZQnCJKZSdOK7SQ2C14I2m39UTnQsUOz67YgRsmiFCdk48c/L+oy5Ebdt3FG9YlKVKvYJJSv5Q4uJriWNl2oMWR0bhxmYB+TZgU056Ot2OY2hgHZmK2COlQRjiQtQ71b+SFaHt8oYQDvFA2ju+97975/fu7Up37t27Ix3fW7/3HVR8t1aRjtfvPYGKJ1J1df3eHrexsn7v3vrKObf33frxKOeNMM76g8HCyRlRtD3HS/LUrmDpFhkXYnWmpxsTRYJB9rSeyqHRjP7uyvqdJ3tHSysb3N7KCga2tFHdOzpaW33CnePaO6sre9KT1dVqZXf1+OgI1IpUWc/wTmXHdvA5BFlWfZxRIrAHXqraVoaYxfNBcJnh5CMNZ6CdEWN1vraC19cA8/nKKnbmsM7bY5iX1loYswSYK9Ly0i5gXh3GTA8K6Sdi+wQfViE7n+BRDiUPVNNJbeWns1sTvWMDQ+Z0cTjcBhuyi2f5aHX1vLpBMQOfqxXAvHR8zDAvHe8uUcyYz1mYTTLfquPpZP/C8xzLHZ135MiDI1gDPyl6ONFVbmPrw3vt4VrCX+yzUXcIpIB5GBgz1DHM2DZWWyukKovPEP6cYE3Auyf4oND4zhwmvmeMRkjy94qOEOdGeE/MGA3gqd5XtZFpAMxYNKQnYK/3sOTWn6wunUNcAph3jxnm1TsYbXXveGl5Y28CZnB5RJx+VcPJR4As1x01C/RgqulZPj6yZT+M/NTsUP47owdBGZ/p5xFdg7E8v9lbpZjXiPWeJs/kCaD4PV/mXWWS+2+21WdDFUg2DBL8YVRkO911wvCpmw5H0IkBjkZ6AgAHleclrMKGMAOs3RhzdZlhrkuT+Iz9AtsWlEA3wkyvHRtC9XvM6MSrfG45T/f3AfXQQMBVstwkPWo+BI9x+IZH6ysbYCuyMdfXGGZub/VyzLyl2JaHU3lkQyujww/Pnu+/6Mgvf+S4Tnxy8sX+Dz/9ZHLoWVqfgZfvsHSSZSJvNOl1Z31ld/eIYl6j+vn8aOOIYOY27mHM6y3sOjHMy1l6g3GoLVhINT18PE8Ie9GYjBj7B5sH+/sHB4868oWpdl5dXBxACaqec+jhyAKVfSzPyEOWOHZA5OjJ8eoRLK1zaWNpaQNWIyw9UnEHiw5gXlqCZVpZr1aPl45bdeBzBQLGLE+Kk22RLDIeBxlZnH6xv0no4ODi0aMXF49evHjx/MUFRi2D7xeOKAgehEj1dSfr+GS9WqkCDf7E1zCgDQlfQacNUldPN46TqwTTQ7sXBwTzS6S+fNV//eji9OWPp7zx88H+M2w7Mg7cGL6jh6kbXLa/g9tit4If9fcyv4c84ZIUcedi83WHO+3A1eZrMoQD4/nL/c0DnVP3M6IcXVOt5Jb12o2YarVt+tnaIZ/b9e0ntOXNmybJM3ZnB52rO+zqzUZrLEZUNeGSNFXnFnrd6fc5+dUrnkP9t7dubW4+AuTPEKcrz8ZmyY/QYFtp5+Y3jO42pN278Llb4boF+Cw0uWYhbltcPAMpkG7cjStuSOnG2ugzIvGSI9Knb7n3t293uP6tU1xEt2/dwrA392Gsz4Uhm4Nn0jPQwJWa+eZuTA2udvPu3ZsNYH7xm7vfgMKW3twd0CxwE3egdEOq3Bi03dweERlw36anpE9fc+/fve1w7+/Tcv8Woc2DFwDyqT10Lx8hj5N7iRDOwBOLbzCVAPNijBlqCWY8iOKNQgHKizckOqgbb268KWLMN2/eXCzeKC7evHl3sTHq/Au9qcsQ/YLedj50+Hfv2Rhe3b5NOc1h6RgacGCCbVcHKzMPD55BElDrjKsVAAXGXIJaghnwFGqVeqMIFcstGBQuQ+d6o0IwF7qssTSiQGRbmJ6aeXv6C/+hj+73Wfn1bQL61oF+wXMvfkivbBW/wGEMIscaPLDYjQuFm4sFinlxcQcw3ygsLha6pNsi7lYrwAcT3gpuLOLkXaO4uFgaDW9dcfp5gA/9D3wfMHdYuXObgb7YRxBLpRmN2ibWdkm5tQyoZlkBP7yIMS8sDjCTEVVm4KKGoS8mmHcLiwWCmTUOE7LFqTnS018/8J3fBpi52ww0WYbPhrw4tz2EuXKjWCiUmLJqlOAaY54vFAoEM27EmKUZuMCYyQfDDAWCWZob1KYeNBJxjtLvv6HT309/TTB3+gz0wXMQrf20rtQ1nFoflGulYrHEhKPxLVwTzMViEWM+K7LGylyxONMknb/tJpihEWOu0sYRksPpe4/93xH3xx+/9ZMK9I6C3gTfifNfpG91onJyyjo2F0rF0hld9Y2FUmkZY56JMQPG5S5pKZbm61zt22Jp4ayJSarslkqlBQz17NtSaWfciFtKe+phpt9OudPf//gjNQrG6EdwfToUST0Ej2+g6zhpp7SwMEOFozEPKDDmuYWFEsEMnws1qVKDBuAkLgPNz8/PzEqVWXzdBBVCG8dIVoSp5xs7f3LcH//6d2oU9+9TRj8HPeEPVgNCTgRhZIoBtZmFhTk63w24nCGY5+cXMObteYC1szMH9XkQ2BbUzxPYgBEwzy/Ms8Yul0GOMvUtMx4wo3/9K1Xz/j6TDrCNaBDLqK7Zw6HvoGP9EIDMMczAQYw5B1VbGDNUzOfxnzI2GrMY8/zM3FweNE1ldj6mLC7jZ4nKpWei//zXn4NChzH6ArN0kDqQI+Mhz1tpfQ+cmnlAhKORn5nJYczwOUMwQ9NMbba8tY3bpS4u585arSZIbwV/b2YL/s/NZqdL+Ui5xIJDn//8Z1A4fccwv+SwRCSYHRVU0NBBn24ZGFejmOGKYJ6bmyOYc3NzuWalGe8e13JxV4wZCluNLehanrAthM9aX7bPyf/f6aDQYQK9OdQFefKJzJlpdd/K5XL5Haw5GuVcrowxw2eOYM7DRQpQDcrlBDMU5lq4S35nAiBPES89a3GaEg6OMfoADeXHIhViFCN9J4qsNYI5H2POT8Oca9Ufw9/H2bssnCHa9kftzb5njP5x6Fu+Ac6zPDT6WpkhyeTzJZg5/JE/m4AhUJToY3bB+7fvE8yPhjC7Jl6AQ65AhbH10zC3DnHnSYxW7CtvzWI6ZZg34zQ2xeziBThsoPDTH7c+ETPpVM5S0CCUoDps4SOk4/T+/cTn4HCCg2E2xxzbLrCqfPaJmLlmPl7DIyRDOCTbtjL1aMsI5l8Z5h/JdwJaixOPqU7kURU8vXnpipgb5HtSgplM04MsdadrJmcK9uWWJSH0jsnGJp4cw4kxp9+Ol6h3dFYm2GLMlUv5XK+lMLceT1B3fCA4qqXYVzhclmBmCnpfJ1hpra+jtHz9d2tnC/7liEg2CNbZnZ3cFMw56L6Tn01hlmbxWLNWoSvYJ+TI61XXIcWMU0zf4yNVlLugn4c6Pc7lgXIpzDlW3uKybQrpkN9OYSYSXc5Sd7L21LDwmeCrgsaYN1/rr4DRPCezIyzIGcb833xMD7pc97/lpJgHg1zF8MqDkBoYGjduS0fkkyxIaQePM0uibRHhM/JtTZsmHonVk0Gc34JbfQGYn3M6C93lkbTjzmxM+Omt2nZSnt3pss8ETGPQu1HZoo1EOM7w5VYGaF9jTpJqTjlh9QdzOfr33797zxPIm/vPOIu53/Lf+1sP+mX5JEx//pvys3+/86EPnxjywb7Btdnc6KNnb6ZtB0uTipfsIQ9ItcPLO/3n34TP/Xen7/s4O0OyvBAPsoMenKN3y8vfJrSc78Lzu6txsXxWaW3NsNLKTqsym18GmicSUMsv4cLyUo5ZPanefFNcppSDpVhajmmWjQp5030k/k+wlb8TzJ13pwiC8NNHJG33HJZgfKIzQIPMIU4VEg3VjRONBZKuuJHkEaFUw2nFu7ukX3OR9mLudPPO4mKcdPymxNVLyX2/uRHPhDXd6z/9jec6v/1+iq02yRqcvsLa+eB7Hm/oU+OHsGi0CndvUiqSp0slWr7LwDRokWY7m7TnNg5FWkXSrUQA1c8KNL9Iv7uQuu1NMlyycMzpmejfPvDcn/1f+wC5T/hOkroH+1jAdfa2INknrRfjexdJyNRYZKU4zUGLBYK5SxsLWP22SuSa5ObqJdJQvNFo1GqNRiFHs3w35xtQ2t2WOER2AdWpvij/6wfEvf/zlw/o/jtS0Sd5xn3iITHMiExUvbjIiGBulVgp9nPOWCMZQrcwKLW+JZeYz/VZuACETXIaArwPGNMO6dfExypgWmiyn7en/b5B5/f+KWDu379/nyxDmUBmTp1O8/10yPVSgRHGXJlhhTgDxp3RMk0YdYuFpNiaJ1cLdZxhAnyFmaHgtbmMW6kHI2FRxm+QO8qUjH//t34HMIMH2ifl14TLLIWkp/fW6qUiIwzzLL5OXGBWs0xsRC3uW1xotmboRZ1rzRSKxcLysNcsLcT3JGQqNlg/U5uyCPu/dPrc+7709h3hJtUZPzKraKRPgtcXYphw/+Y8ux44ZgzzPMVciqk4312gn3Vumwx7NEdQw+3zsTmURcfSdDTtVfXOO+4Xrv8eQirC55eA+OfBUY+0O1hfiGHs1Cs7rJCa5m1W00xwMJqj1zN1aQ5/LjRGILTmcW0y+LaNXNEYPcOQJvQOve90foF4+y3euMSyPJAHOa1y6jR/hdNa0tkMvZpJTfM2raJOTyPpnNBMvU6+NT+av5VICu8wHr2rGZwVWtqUMOX9e+6i8wqkYhPW3YuDzYMXKS1jp1J0rZk4aTXbzbPsVWoTh2a85ufLRFs3aGFmLsl0zefqzZnslFcTJ83m4qHI+Dzl9PPF6FWn//ZRh+NfH5zKP28e/DxYsLLRTh2nbuGkFaGd+Kqckkya8YI6ipl1qeXjL83k6/QOc+OO3CG5KyvwkYA3FpTeZMzcy1uvH916Cd0uHl0QZy6BDLFCapOxlZtjFF8cphWANEurDylmWsjVu4fxt/LVSp58juX2uTPSUGUlHb8FYSrTTp+fPtq8tfmof2pcHBww+0fH21aUdCCJk11DlB/a3qMBSC7HMNNCvkVSN4RgArZwLcvEVJuter1Oj9pVcTQcR+Yc72FP1BenaDv10ebF202Ai3fAY80sm5yu9ALFFqdgzqWDuUmYpbPDBHONXNJMTPfBg8P81g7eqOXAD0yzgJhfPpyi7fSDzZ9/ZqcM9l8gavbciLPaEAErg9GOYR5wJo25TKb4jBZyVRxClWPMFRpCEmXXJDzPU5xkMgbxLFGx6hTheLn/w8/47MbB/j71MnwDYlcX4YMP6aUwjjn3OCUcdYY5Xx/BHI8GL84ugY+TTwzzHPsymaFkeegnxEObyGh08UxW9WcA+4dnlKd4G0JzVZLHMZXk1ZoMzGlG17cmYabJGoJZ2i4T7jYZ5lyOfXtnKLeLHhIkE3/NA40dpLc83nAi+rI5GvyYSQbmfCpJmIU5P0fbW2WcFiA6jgpKeafapL3Zt3EeLTVtBomt+En7yAbzoAZj8m3VNEy2H6onh/wzMKcZzTDThUlTHAlmmsqgkULjkAjF4Ry9Aft2BeejDweamx5HmuRDmxSzMXjLwxdNS+bYARNVi7frWvmYu9s7yWUuYU1rLsX6GHMyD7UHDDMntfKH+WTQhzAeUj07nI+Wp2YYTXo6UR1sB/iC9zT5RqSIxgjmcqP1IHlm4vC0cuOYc3PJC3ln5cH2SXM2d1jOx5i3zvCrhs1DLNADu+pOSyEZ1FPlRSwD5OcHrKCXbIXKAXHBhzGfcQmjc/mY0eOY8+XDx7kua5e2UzMvtbrbucegn3OHEjd7mNuutVo4+ZcbvHOIJhwNpKjESMZIAzwbMs5UW5F5En9BV57GXmGKzzRLTzHGEs2aKa+aOKs12+hWKwnnKsMJI0mqN2uzBHM5ny/nCeS0MyBP8Td4X0P4DRtXkXlDxm+I+T0uOazmaroroDHMVGcNiWzcXD5rSc3tbmts86+SlQIF093dyR0m300pfH1K6C2fmH7b4GTNQKEqgqSYD5HOrB9yNENmCYM0Zq4ZY05UB67Jlx8fwjxnvqg0mSrV7vaDB/n8CGZ+2i+4IM+1RZcPHL7n+XpgmYPzNciDFcp+yWQIM1nnlKhWlRoP8luztctegp1IzbOtfHkIM0zylHyBHji+Zrga7wYAF/8+UII50GROp75dM5/m7EB1kBSydLbVaE7YhboiVZpnD4Yxo2kJMP8nzntoaqapuiQhmbwlDbIhw58MzGnVsdOoVMfl9+NJqn/ETQyXk8PID32do8eJ47fkeAsw8/TIdnNYgmM9gTXV9Rj8aYQz5l6I3CAYbXGx9qbjGOGzhF2K8uOtbuvKKdq/nPweAgs4GhuY2DzSTYARzGC58rmzS96W/8xk+dhdHj1WY9hJxn2AmWp+UMJ/gQxfi8hbcG5vRL3IYfILAAlmZvpGX5r6+wkRUymPYuZ6yTnqBHPu8EH3i+PFRF8XQ2P7tX4SlcWY8w+2m19aKNI0/rNSehLGsKDzcLb6VTB5CqEkqUpijbmzL6GLP5aS3yevlcsPGtWpfb8WirfbWg/y/wgeY2JeXaX8j0HMcQ7BLH0Rn+JTyfmYw0xfCU34QYWvmqb/5M1XSXzmLw593WT8A0XjC/7g+6fSxNTkV0yX/Zbi30D/D+c+ZUzPALI4AAAAAElFTkSuQmCC'
  },
])
const isDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const teamToDelete = ref<Team | null>(null)
const newTeam = ref<Team>({
  name: '',
  owner: '',
  logo: ''
})

const addTeam = () => {
  teams.value.push({ ...newTeam.value })
  newTeam.value = { name: '', owner: '', logo: '' }
  isDialogOpen.value = false
}

const confirmDelete = (team: Team) => {
  teamToDelete.value = team
  isDeleteDialogOpen.value = true
}

const deleteTeam = () => {
  if (teamToDelete.value) {
    const index = teams.value.findIndex(t => t.name === teamToDelete.value?.name)
    if (index !== -1) {
      teams.value.splice(index, 1)
    }
  }
  isDeleteDialogOpen.value = false
  teamToDelete.value = null
}
</script>

<template>
  <div class="container py-8 mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Teams</h1>
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger asChild>
          <Button class="ml-auto">
            Add Team
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Team</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new team.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label for="team-name">Team Name</label>
              <input
                id="team-name"
                v-model="newTeam.name"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Enter team name"
              />
            </div>
            <div class="grid gap-2">
              <label for="owner-name">Owner Name</label>
              <input
                id="owner-name"
                v-model="newTeam.owner"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Enter owner name"
              />
            </div>
            <div class="grid gap-2">
              <label for="logo-url">Logo URL</label>
              <input
                id="logo-url"
                v-model="newTeam.logo"
                class="w-full px-3 py-2 border rounded-md"
                placeholder="Enter logo URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button @click="addTeam">Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="team in teams"
        :key="team.name"
        class="relative p-6 border rounded-lg shadow-sm group hover:shadow-md hover:border-gray-400 transition-all duration-200"
      >
        <div class="flex items-center gap-4">
          <img
            :src="team.logo"
            :alt="`${team.name} logo`"
            class="w-16 h-16 object-contain rounded-full"
          />
          <div>
            <h3 class="font-semibold text-lg">{{ team.name }}</h3>
            <p class="text-sm text-gray-600">Owner: {{ team.owner }}</p>
          </div>
        </div>
        <Button
          class="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100"
          variant="ghost" 
          @click="confirmDelete(team)"
        >
          ✕
        </Button>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {{ teamToDelete?.name }}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            @click="isDeleteDialogOpen = false"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="deleteTeam"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>