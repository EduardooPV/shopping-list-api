class DateTimeHelper {
  private static pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  public static format(date: Date): string {
    const day = this.pad(date.getDate());
    const month = this.pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());
    const seconds = this.pad(date.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}

export { DateTimeHelper };
