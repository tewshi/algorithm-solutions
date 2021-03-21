
def isPrime(num) -> bool:
    count = 2
    while (count < num / 2 + 1):
        if (num % count != 0):
            count += 1
            continue

        return False
    return True


def fibo(max=100):
    result = [1, 2]
    even = [2]

    i = 2

    while result[len(result) - 1] < max:
        num = result[i - 2] + result[i - 1]
        result.append(num)
        if (num % 2 == 0):
            even.append(num)
        i += 1

    return sum(even)


print(fibo(4000000))


def largestPrime(num):
    m = 0

    for i in range(int(num / 2), 2, -1):

        if isPrime(i) and (num % i == 0):
            m = i
            print(m)
            break

    print('finished loop')
    return m


print(largestPrime(600851475143))
print("done")
