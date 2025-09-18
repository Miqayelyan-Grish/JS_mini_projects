#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

void student_add();
void show_data();
void search_student();
int lines_counter();
void salary_avg();
void file_utilization();

typedef struct
{
    char name[100];
    char surname[200];
    int age;
    float salary;

} student;

int main()
{
    printf(" input 1 for add student,\n 2 for show data,\n 3 for search student,\n 4 for average salary,\n 5 for file utilization,\n q for quit:\n");
    int choice = 0;
    while (scanf("%d", &choice) == 1)
    {
        switch (choice)
        {
        case 1:
            student_add();
            printf("you can continue... or enter q for quite:\n");
            break;
        case 2:
            show_data();
            printf("you can continue... or enter q for quite:\n");
            break;
        case 3:
            search_student();
            printf("you can continue... or enter q for quite:\n");
            break;
        case 4:
            salary_avg();
            printf("you can continue... or enter q for quite:\n");
            break;
        case 5:
            file_utilization();
            printf("you can continue... or enter q for quite:\n");
            break;
        default:
            printf("invalid value enter the integer from 1 to 5:\n");
            break;
        }
    }
    return 0;
}

void student_add()
{
    FILE *file;
    file = fopen("file2.txt", "a");

    if (file == NULL)
    {
        perror("Error opening file!\n");
        return;
    }
    student obj;

    printf("enter name: \n");
    scanf("%s", obj.name);

    printf("enter surname: \n");
    scanf("%s", obj.surname);

    printf("enter age: \n");
    scanf("%d", &obj.age);

    printf("enter salary: \n");
    scanf("%f", &obj.salary);

    fprintf(file, "%s %s %d %.2f\n", obj.name, obj.surname, obj.age, obj.salary);

    fclose(file);
    return;
}

void show_data()
{
    FILE *file;
    file = fopen("file2.txt", "r");
    if (file == NULL)
    {
        printf("Error opening file!\n");
        return;
    }
    student obj;

    while (fscanf(file, "%s %s %d %f", obj.name, obj.surname, &obj.age, &obj.salary) != EOF)
    {
        printf(":name: %s :surname: %s :age: %d :salary: %.2f :\n", obj.name, obj.surname, obj.age, obj.salary);
    }
    fclose(file);
    return;
}

void search_student()
{
    FILE *file = fopen("file2.txt", "r");
    if (file == NULL)
    {
        perror("Error opening file!\n");
        return;
    }
    bool is_found = false;
    student obj;

    int choice = 0;
    printf("for searching student by name choice 1:\n by surnamename choice 2:\n by age choice 3:\n by range of salary choice 4:\n");
    scanf("%d", &choice);

    if (choice == 1)
    {
        char name[50];
        printf("enter name: \n");
        scanf("%s", name);

        rewind(file);

        while (fscanf(file, "%s %s %d %f", obj.name, obj.surname, &obj.age, &obj.salary) == 4)
        {
            if (strcmp(name, obj.name) == 0)
            {
                printf("found: name: %s, surname: %s, age: %d, salary: %.2f\n", obj.name, obj.surname, obj.age, obj.salary);
                is_found = true;
            }
        }
    }
    if (choice == 2)
    {
        char surname[100];
        printf("enter name: \n");
        scanf("%s", surname);

        rewind(file);

        while (fscanf(file, "%s %s %d %f", obj.name, obj.surname, &obj.age, &obj.salary) == 4)
        {
            if (strcmp(surname, obj.surname) == 0)
            {
                printf("found: name: %s, surname: %s, age: %d, salary: %.2f\n", obj.name, obj.surname, obj.age, obj.salary);
                is_found = true;
            }
        }
    }
    if (choice == 3)
    {
        int age = 0;
        printf("enter age: \n");
        scanf("%d", &age);

        rewind(file);

        while (fscanf(file, "%s %s %d %f", obj.name, obj.surname, &obj.age, &obj.salary) == 4)
        {
            if (age == obj.age)
            {
                printf("found: name: %s, surname: %s, age: %d, salary: %.2f\n", obj.name, obj.surname, obj.age, obj.salary);
                is_found = true;
            }
        }
    }
    if (choice == 4)
    {
        float start = 0.0;
        float end = 0.0;

        printf("enter the range of salary: \n");
        scanf("%f %f", &start, &end);

        rewind(file);

        while (fscanf(file, "%s %s %d %f", obj.name, obj.surname, &obj.age, &obj.salary) == 4)
        {
            if ((obj.salary >= start) && (obj.salary <= end))
            {
                printf("found: name: %s, surname: %s, age: %d, salary: %.2f\n", obj.name, obj.surname, obj.age, obj.salary);
                is_found = true;
            }
        }
    }
    if (is_found == false)
    {
        perror("not found\n");
        return;
    }
    fclose(file);
}

int lines_counter()
{
    FILE *file;
    file = fopen("file2.txt", "r");

    if (file == NULL)
    {
        perror("Error opening file!\n");
        return 0;
    }
    int i = 0;

    char buff[sizeof(student)];

    while (fgets(buff, sizeof(student), file) != NULL)
    {
        i++;
    }
    rewind(file);
    fclose(file);
    return i;
}

void salary_avg()
{
    FILE *file;
    file = fopen("file2.txt", "r");
    if (file == NULL)
    {
        perror("Error opening file!\n");
        return;
    }
    student obj;

    float sum = 0.0;
    float avg = 0.0;

    while (fscanf(file, "%s %s %d %f", obj.name, obj.surname, &obj.age, &obj.salary) == 4)
    {
        sum += obj.salary;
    }
    avg = sum / lines_counter();

    printf("average salary is: %.2f$\n", avg);

    fclose(file);
    return;
}

void file_utilization()
{
    FILE *file;
    char filename[50];

    printf("please enter file name: \n");
    scanf("%s", filename);

    file = fopen(filename, "w");

    if (file == NULL)
    {
        perror("Error opening file!\n");
        return;
    }
    fclose(file);
}